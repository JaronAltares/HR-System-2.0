import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { supabase } from "../supabaseClient";
import { signInWithGoogle } from "../services/authService";

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { firstName, lastName, username, email, password } = formData;

    if (!firstName || !lastName || !username || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // PR-02 Logic: Supabase Register
    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_name: username,
          role: "USER", // Handled by your PR-04 trigger, but good to include here too
        },
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Please check your email to verify your account.</p>
          <Link to="/" className="text-secondary font-bold">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">H</div>
          <h1 className="mt-4 text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2 text-center">Register to HopeHRS</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">First Name</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary">
              <HiOutlineUser className="text-gray-400 text-xl mr-2" />
              <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} className="w-full outline-none text-sm" />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Last Name</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary">
              <HiOutlineUser className="text-gray-400 text-xl mr-2" />
              <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} className="w-full outline-none text-sm" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Username</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary">
              <HiOutlineUser className="text-gray-400 text-xl mr-2" />
              <input type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} className="w-full outline-none text-sm" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary">
              <HiOutlineMail className="text-gray-400 text-xl mr-2" />
              <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} className="w-full outline-none text-sm" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-secondary">
              <HiOutlineLockClosed className="text-gray-400 text-xl mr-2" />
              <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} className="w-full outline-none text-sm" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <button type="button" onClick={signInWithGoogle} className="w-full border border-gray-300 hover:border-secondary hover:bg-gray-50 py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300">
            <FcGoogle className="text-2xl" />
            Register with Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/" className="text-secondary font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;