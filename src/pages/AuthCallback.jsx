// src/pages/AuthCallback.jsx
// M2 – PR-04: feat/ui-auth-callback
// UI ONLY — Supabase session handling on this route is M4's responsibility.
// M4 will add a useEffect that calls supabase.auth.getSession()
// and redirects to /employees on success or /login on failure.

export default function AuthCallback() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#1B263B" }}
    >
      {/* Card */}
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">

        {/* Logo */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: "#59ABBD", color: "#1B263B" }}
        >
          H
        </div>

        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full border-4 opacity-20"
            style={{ borderColor: "#59ABBD" }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: "#59ABBD" }}
          />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1
            className="text-xl font-semibold text-white"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Completing sign in…
          </h1>
          <p className="text-sm" style={{ color: "#9FB3C8" }}>
            Please wait while we verify your account.
            <br />
            You will be redirected shortly.
          </p>
        </div>

        {/* Bouncing dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: "#59ABBD",
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>

      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs" style={{ color: "#4A6080" }}>
        © 2025–2026 Hope, Inc. · New Era University Capstone
      </p>
    </div>
  );
}