import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  // Wait for Supabase to finish resolving the async session check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderTopColor: "#59ABBD" }} />
      </div>
    )
  }

  // FIXED: Layout Outlet pattern allows child routes to mount cleanly inside the shell layout
  return user 
    ? <Outlet /> 
    : <Navigate to="/login" replace />
}