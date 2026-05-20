// src/routes/ProtectedRoutes.jsx
// FIX: .eq("userid") → .eq("userId") — DB column is camelCase.
// Lowercase typo caused the query to return null for every user,
// making ProtectedRoute deny everyone even with a valid session.

import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading"); // "loading" | "allowed" | "denied"

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setStatus("denied");
          return;
        }

        // FIX: column is "userId" (camelCase) — not "userid"
        const { data: userRow, error } = await supabase
          .from("user")
          .select("record_status")
          .eq("userId", session.user.id)
          .single();

        if (error || !userRow || userRow.record_status !== "ACTIVE") {
          await supabase.auth.signOut();
          setStatus("denied");
          return;
        }

        setStatus("allowed");
      } catch (err) {
        console.error("ProtectedRoute check failed:", err);
        setStatus("denied");
      }
    }

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setStatus("denied");
      } else {
        checkAccess();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderTopColor: "#59ABBD" }}
        />
      </div>
    );
  }

  return status === "allowed" ? <Outlet /> : <Navigate to="/login" replace />;
}