import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { supabase } from "../supabaseClient";
import { signInWithGoogle } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

   if (authError) {
      setError(authError.message);
    } else {
      // Login Guard — check if user is ACTIVE
      const { data: { user } } = await supabase.auth.getUser()
      const status = user?.app_metadata?.record_status

      if (status !== 'ACTIVE') {
        await supabase.auth.signOut()
        setError("Your account is inactive. Please contact an Admin to activate your account.")
      } else {
        navigate("/employees")
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Google Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">H</div>
          <h1 className="mt-4 text-3xl font-bold text-primary">HopeHRS</h1>
          <p className="text-gray-500 text-sm mt-2 text-center">Human Resource Management System</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary transition-all">
              <HiOutlineMail className="text-gray-400 text-xl mr-2" />
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full outline-none bg-transparent text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary transition-all">
              <HiOutlineLockClosed className="text-gray-400 text-xl mr-2" />
              <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full outline-none bg-transparent text-sm" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <button type="button" onClick={handleGoogleLogin} className="w-full border border-gray-300 hover:border-secondary hover:bg-gray-50 py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300">
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-secondary font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;