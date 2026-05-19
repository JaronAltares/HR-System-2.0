// src/pages/RegisterPage.jsx
// M2 – PR-02: feat/ui-register-page
// UI ONLY — Auth wiring (signUp, signInWithOAuth) is M4's responsibility.
// M4 will pass onEmailRegister and onGoogleRegister as props.

import { useState } from "react";
import { Link } from "react-router-dom";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm({ firstName, lastName, username, email, password, confirmPassword }) {
  const errors = {};
  if (!firstName.trim()) errors.firstName = "First name is required.";
  else if (firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters.";
  if (!lastName.trim()) errors.lastName = "Last name is required.";
  else if (lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters.";
  if (!username.trim()) errors.username = "Username is required.";
  else if (username.trim().length < 3) errors.username = "Username must be at least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) errors.username = "Only letters, numbers, and underscores allowed.";
  if (!email.trim()) errors.email = "Email address is required.";
  else if (!validateEmail(email)) errors.email = "Please enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  else if (!/[A-Z]/.test(password)) errors.password = "Must contain at least one uppercase letter.";
  else if (!/[0-9]/.test(password)) errors.password = "Must contain at least one number.";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#EF4444" };
  if (score <= 3) return { score, label: "Fair", color: "#F59E0B" };
  if (score === 4) return { score, label: "Good", color: "#59ABBD" };
  return { score, label: "Strong", color: "#22C55E" };
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" tabIndex={-1} onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition-colors duration-150" aria-label={show ? "Hide password" : "Show password"}>
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );
}

export default function RegisterPage({ onEmailRegister, onGoogleRegister, authError, authSuccess }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(form.password);

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function inputClass(hasError) {
    return `w-full rounded-lg border px-4 py-3 text-sm text-gray-900 bg-white shadow-sm placeholder-gray-400 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${hasError ? "border-red-400" : "border-gray-300"}`;
  }

  function focusStyle(e, hasError) {
    if (!hasError) { e.target.style.borderColor = "#59ABBD"; e.target.style.boxShadow = "0 0 0 3px #59ABBD22"; }
  }
  function blurStyle(e, hasError) {
    if (!hasError) { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      if (onEmailRegister) await onEmailRegister(form.firstName.trim(), form.lastName.trim(), form.username.trim(), form.email.trim(), form.password);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setIsLoading(true);
    try {
      if (onGoogleRegister) await onGoogleRegister();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: "#1B263B" }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.08]" style={{ backgroundColor: "#59ABBD" }} />
        <div className="absolute bottom-0 -left-10 w-80 h-80 rounded-full opacity-[0.06]" style={{ backgroundColor: "#59ABBD" }} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "#59ABBD", color: "#1B263B" }}>H</div>
          <span className="text-white text-xl font-semibold tracking-wide">Hope, Inc.</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Join the<br />HR<br /><span style={{ color: "#59ABBD" }}>Portal</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#9FB3C8" }}>
            Create your account to request access. An HR Administrator will activate your account before you can sign in.
          </p>
          <div className="space-y-3 pt-2">
            {["Fill in your details below", "Confirm your email address", "Wait for admin activation", "Sign in to the HR portal"].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: "#59ABBD22", color: "#59ABBD", border: "1px solid #59ABBD44" }}>{i + 1}</div>
                <p className="text-sm" style={{ color: "#9FB3C8" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "#4A6080" }}>© 2025–2026 Hope, Inc. · New Era University Capstone</p>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md space-y-7">
          <div className="flex items-center gap-3 lg:hidden pt-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: "#1B263B", color: "#59ABBD" }}>H</div>
            <span className="font-semibold text-lg" style={{ color: "#1B263B" }}>Hope, Inc. · HRS</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold" style={{ color: "#1B263B", fontFamily: "'DM Serif Display', Georgia, serif" }}>Create account</h2>
            <p className="text-sm text-gray-500">All fields are required. Your account will be activated by an HR Admin.</p>
          </div>

          {authError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          )}

          {authSuccess && (
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700">{authSuccess}</p>
            </div>
          )}

          <button type="button" onClick={handleGoogleRegister} disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Register with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1.5" style={{ color: "#1B263B" }}>First Name</label>
                <input id="firstName" type="text" value={form.firstName} onChange={handleChange("firstName")} placeholder="Maria" disabled={isLoading} autoComplete="given-name" className={inputClass(errors.firstName)} onFocus={(e) => focusStyle(e, errors.firstName)} onBlur={(e) => blurStyle(e, errors.firstName)} />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1.5" style={{ color: "#1B263B" }}>Last Name</label>
                <input id="lastName" type="text" value={form.lastName} onChange={handleChange("lastName")} placeholder="Santos" disabled={isLoading} autoComplete="family-name" className={inputClass(errors.lastName)} onFocus={(e) => focusStyle(e, errors.lastName)} onBlur={(e) => blurStyle(e, errors.lastName)} />
                <FieldError message={errors.lastName} />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1.5" style={{ color: "#1B263B" }}>Username</label>
              <input id="username" type="text" value={form.username} onChange={handleChange("username")} placeholder="msantos_hr" disabled={isLoading} autoComplete="username" className={inputClass(errors.username)} onFocus={(e) => focusStyle(e, errors.username)} onBlur={(e) => blurStyle(e, errors.username)} />
              <FieldError message={errors.username} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "#1B263B" }}>Email Address</label>
              <input id="email" type="email" value={form.email} onChange={handleChange("email")} placeholder="maria@hope.com" disabled={isLoading} autoComplete="email" className={inputClass(errors.email)} onFocus={(e) => focusStyle(e, errors.email)} onBlur={(e) => blurStyle(e, errors.email)} />
              <FieldError message={errors.email} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "#1B263B" }}>Password</label>
              <div className="relative">
                <input id="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange("password")} placeholder="Min. 8 chars, 1 uppercase, 1 number" disabled={isLoading} autoComplete="new-password" className={`${inputClass(errors.password)} pr-11`} onFocus={(e) => focusStyle(e, errors.password)} onBlur={(e) => blurStyle(e, errors.password)} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><EyeToggle show={showPw} onToggle={() => setShowPw((v) => !v)} /></div>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: i <= strength.score ? strength.color : "#E5E7EB" }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label} password</p>
                </div>
              )}
              <FieldError message={errors.password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5" style={{ color: "#1B263B" }}>Confirm Password</label>
              <div className="relative">
                <input id="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={handleChange("confirmPassword")} placeholder="Re-enter your password" disabled={isLoading} autoComplete="new-password" className={`${inputClass(errors.confirmPassword)} pr-11`} onFocus={(e) => focusStyle(e, errors.confirmPassword)} onBlur={(e) => blurStyle(e, errors.confirmPassword)} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} /></div>
              </div>
              <FieldError message={errors.confirmPassword} />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-sm disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
              style={{ backgroundColor: "#1B263B" }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#59ABBD"; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#1B263B"; }}>
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 pb-8">
            Already have an account?{" "}
            <Link to="/login" className="font-medium hover:underline transition-colors" style={{ color: "#59ABBD" }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}