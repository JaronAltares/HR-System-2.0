import { useState } from 'react'

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    if (!form.firstName.trim()) return 'First name is required.'
    if (!form.lastName.trim()) return 'Last name is required.'
    if (!form.username.trim()) return 'Username is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!form.password.trim()) return 'Password is required.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    return null
  }

  function handleEmailRegister(e) {
    e.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    // Supabase signUp() will be wired here by M4 via AuthContext
    console.log('Email register triggered', form)
    setLoading(false)
  }

  function handleGoogleRegister() {
    setError('')
    // Supabase Google OAuth will be wired here by M4
    console.log('Google register triggered')
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-navy">Hope, Inc.</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your HR System account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleEmailRegister} noValidate>
          {/* First Name + Last Name side by side */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="dela Cruz"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="juandelacruz"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="juan@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-teal text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-3 text-gray-400 text-xs">or</span>
          <hr className="flex-grow border-gray-200" />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.09-6.09C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.48 3.44 14.22l7.08 5.5C12.3 13.59 17.68 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.58C43.18 37.13 46.1 31.27 46.1 24.5z"/>
            <path fill="#FBBC05" d="M10.52 28.28A14.6 14.6 0 0 1 9.5 24c0-1.49.26-2.93.72-4.28l-7.08-5.5A23.9 23.9 0 0 0 0 24c0 3.86.92 7.5 2.56 10.72l7.96-6.44z"/>
            <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.94l-7.18-5.58C28.6 38.1 26.42 39 24 39c-6.32 0-11.7-4.09-13.48-9.72l-7.96 6.44C6.07 43.52 14.56 47 24 47z"/>
          </svg>
          Register with Google
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-brand-teal font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage