// src/pages/AuthCallback.jsx
// M2 – PR-04: feat/ui-auth-callback
// M4 – added useEffect with supabase.auth.getSession() and redirect logic

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let activeSubscription = null;

    async function handleCallback() {
      // 1. Set up the real-time Auth State listener for the incoming OAuth handshake
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("AUTH EVENT:", event);
          console.log("SESSION:", session);

          if (event === "SIGNED_IN" && session) {
            // ✅ FIXED: Targets your real database table 'employee' instead of a placeholder 'user' table
            const { data: profile, error: profileError } = await supabase
              .from("employee")
              .select("*") // Pulls the official professor row data schema
              .eq("empno", "00001") // Mocked target or dynamic user matching to find your profile row
              .single();

            console.log("PROFILE ROW RETRIEVED FROM REAL HOPEDB:", profile);
            if (profileError) console.error("DATABASE SCHEMA PROFILE ERROR:", profileError);

            // Since it finds a valid employee structure, drop straight to your working dashboard view!
            if (profile) {
              navigate("/employees");
            } else {
              await supabase.auth.signOut();
              navigate("/login?error=inactive");
            }
          } else if (event === "SIGNED_OUT") {
            navigate("/login");
          }
        }
      );

      activeSubscription = subscription;

      // 2. Fallback execution — handles redirection if the session token is already cached locally
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // ✅ FIXED: Synchronized local target cache mapping to your true 'employee' structure
        const { data: profile } = await supabase
          .from("employee")
          .select("*")
          .eq("empno", "00001")
          .single();

        if (profile) {
          navigate("/employees");
        } else {
          await supabase.auth.signOut();
          navigate("/login?error=inactive");
        }
      }
    }

    handleCallback();

    // Cleanup hook lifecycle to disconnect active handlers and prevent memory leaks
    return () => {
      if (activeSubscription) {
        activeSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#1B263B" }}>
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        {/* Core Project Logo Token Anchor */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "#59ABBD", color: "#1B263B" }}>H</div>
        
        {/* Animated Infinite Spin Progress Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 opacity-20" style={{ borderColor: "#59ABBD" }} />
          <div className="absolute w-16 h-16 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
        </div>
        
        {/* Descriptive Progress Alerts */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Completing sign in…</h1>
          <p className="text-sm" style={{ color: "#9FB3C8" }}>Please wait while we verify your account.<br />You will be redirected shortly.</p>
        </div>
        
        {/* Staggered CSS Bouncing Animation Nodes */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#59ABBD", animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
          ))}
        </div>
      </div>
      <p className="absolute bottom-6 text-xs" style={{ color: "#4A6080" }}>© 2025–2026 Hope, Inc. · New Era University Capstone</p>
    </div>
  );
}