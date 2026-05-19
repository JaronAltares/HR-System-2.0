<<<<<<< HEAD
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          HopeHRS
        </h1>
        
        <h2 className="text-xl text-center mb-6">Login</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
            Login
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
=======
// src/pages/LoginPage.jsx
// M2 – PR-01: feat/ui-login-page
// UI ONLY — Auth wiring (signIn, signInWithOAuth) is M4's responsibility.
// M4 will pass onEmailLogin and onGoogleLogin as props.

import { useState } from "react";
import { Link } from "react-router-dom";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(email, password) {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Email address is required.";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

export default function LoginPage({ onEmailLogin, onGoogleLogin, authError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      if (onEmailLogin) await onEmailLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      if (onGoogleLogin) await onGoogleLogin();
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: "#1B263B" }}>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: "#59ABBD" }} />
        <div className="absolute bottom-12 right-0 w-64 h-64 rounded-full opacity-[0.07]" style={{ backgroundColor: "#59ABBD" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "#59ABBD", color: "#1B263B" }}>H</div>
            <span className="text-white text-xl font-semibold tracking-wide">Hope, Inc.</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Human<br />Resource<br /><span style={{ color: "#59ABBD" }}>System</span>
          </h1>
          <p className="text-base leading-relaxed max-w-xs" style={{ color: "#9FB3C8" }}>
            Centralized employee management, job history tracking, and department oversight — all in one secure platform.
          </p>
          <div className="flex gap-8 pt-4">
            {[{ label: "Employees", value: "31+" }, { label: "Departments", value: "8" }, { label: "Job Roles", value: "14" }].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs tracking-widest uppercase" style={{ color: "#59ABBD" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "#4A6080" }}>© 2025–2026 Hope, Inc. · New Era University Capstone</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: "#1B263B", color: "#59ABBD" }}>H</div>
            <span className="font-semibold text-lg" style={{ color: "#1B263B" }}>Hope, Inc. · HRS</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold" style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}>Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to access the HR portal.</p>
          </div>

          {authError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          )}

          <button type="button" onClick={handleGoogleLogin} disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: "#1B263B" }}>Email Address</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={handleEmailChange} placeholder="you@hope.com" disabled={isLoading}
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 bg-white shadow-sm placeholder-gray-400 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.email ? "border-red-400" : "border-gray-300"}`} />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: "#1B263B" }}>Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={handlePasswordChange} placeholder="Enter your password" disabled={isLoading}
                  className={`w-full rounded-lg border px-4 py-3 pr-11 text-sm text-gray-900 bg-white shadow-sm placeholder-gray-400 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.password ? "border-red-400" : "border-gray-300"}`} />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: "#1B263B" }}>
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium transition-colors duration-150 hover:underline" style={{ color: "#59ABBD" }}>Register here</Link>
          </p>

          <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-3">
            <p className="text-xs text-center text-gray-400">New accounts require activation by an HR Administrator before you can sign in.</p>
          </div>
        </div>
>>>>>>> 75907bf20ec25d4ce781884b318e6022495a7b0e
      </div>
    </div>
  );
}