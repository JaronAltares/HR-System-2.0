// src/pages/AuthCallback.jsx
// M4 – feat/auth-google-oauth
// Handles OAuth redirect, checks record_status = 'ACTIVE' on user table

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let activeSubscription = null;

    async function handleCallback() {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("AUTH EVENT:", event);
          console.log("SESSION:", session);

          if (event === "SIGNED_IN" && session) {
            const { data: userRow, error } = await supabase
              .from("user")
              .select("record_status, user_type")
              .eq("userId", session.user.id)
              .single();

            if (error || !userRow) {
              await supabase.auth.signOut();
              navigate("/login?error=not_found");
              return;
            }

            if (userRow.record_status !== "ACTIVE") {
              await supabase.auth.signOut();
              navigate("/login?error=inactive");
              return;
            }

            navigate("/employees");
          } else if (event === "SIGNED_OUT") {
            navigate("/login");
          }
        }
      );

      activeSubscription = subscription;

      // Fallback for already-cached session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userRow, error } = await supabase
          .from("user")
          .select("record_status, user_type")
          .eq("userId", session.user.id)
          .single();

        if (error || !userRow || userRow.record_status !== "ACTIVE") {
          await supabase.auth.signOut();
          navigate("/login?error=inactive");
          return;
        }

        navigate("/employees");
      }
    }

    handleCallback();

    return () => {
      if (activeSubscription) activeSubscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#1B263B" }}>
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "#59ABBD", color: "#1B263B" }}>H</div>
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 opacity-20" style={{ borderColor: "#59ABBD" }} />
          <div className="absolute w-16 h-16 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Completing sign in…</h1>
          <p className="text-sm" style={{ color: "#9FB3C8" }}>Please wait while we verify your account.<br />You will be redirected shortly.</p>
        </div>
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