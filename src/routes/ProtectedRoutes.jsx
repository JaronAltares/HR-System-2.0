// src/routes/ProtectedRoutes.jsx
// M2 – Sprint 2
// Bypasses global context locks to resolve session states directly via Supabase

import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute() {
  const [sessionUser, setSessionUser] = useState(null);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    async function checkDirectSession() {
      try {
        // Fetch the user session straight from the Supabase client instance
        const { data: { session } } = await supabase.auth.getSession();
        setSessionUser(session?.user || null);
      } catch (err) {
        console.error("ProtectedRoute direct resolution exception:", err);
        setSessionUser(null);
      } finally {
        setIsResolving(false);
      }
    }

    checkDirectSession();

    // Listen for real-time auth events to handle sudden token dropouts or logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
      setIsResolving(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 1. Render a clean fallback spinner ONLY during the fast direct initialization handshake
  if (isResolving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
      </div>
    );
  }

  // 2. Clear to render child components cleanly if a valid session exists
  return sessionUser 
    ? <Outlet /> 
    : <Navigate to="/login" replace />;
}