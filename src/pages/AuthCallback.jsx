function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-secondary rounded-full animate-spin"></div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-primary">
          Authenticating...
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-2 text-sm">
          Please wait while we verify your login with Google OAuth.
        </p>

        {/* Loading note */}
        <p className="text-gray-400 text-xs mt-6">
          You will be redirected automatically.
        </p>

      </div>
    </div>
  );
}

export default AuthCallbackPage;