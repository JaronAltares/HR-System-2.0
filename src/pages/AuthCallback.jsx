import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const status = session.user?.app_metadata?.record_status;
        if (status === "ACTIVE") {
          navigate("/employees");
        } else {
          supabase.auth.signOut();
          navigate("/login?error=inactive");
        }
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#1B263B" }}
    >
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div
          className="absolute inset-0 rounded-full border-4 opacity-20"
          style={{ borderColor: "#59ABBD" }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{ borderTopColor: "#59ABBD" }}
        />
      </div>

      {/* Bouncing dots */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#59ABBD",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <p className="text-sm" style={{ color: "#9FB3C8" }}>
        Completing sign in... You will be redirected shortly.
      </p>
    </div>
  );
}