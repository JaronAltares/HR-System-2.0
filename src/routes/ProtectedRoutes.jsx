// src/routes/ProtectedRoutes.jsx
// FIX: Was only checking if a Supabase session exists.
// An INACTIVE user with a valid session could bypass the login guard entirely.
// Now also checks record_status = 'ACTIVE' from the user table on every load.

import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading"); // "loading" | "allowed" | "denied"

  useEffect(() => {
    async function checkAccess() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setStatus("denied");
          return;
        }

        // FIX: also verify record_status = 'ACTIVE' — a session alone is not enough
        const { data: userRow, error } = await supabase
          .from("user")
          .select("record_status")
          .eq("userid", session.user.id)
          .single();

        if (error || !userRow || userRow.record_status !== "ACTIVE") {
          // Sign out the inactive/missing user so they land on the login error
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setStatus("denied");
      } else {
        // Re-run the full check when auth state changes
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

  return status === "allowed" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}