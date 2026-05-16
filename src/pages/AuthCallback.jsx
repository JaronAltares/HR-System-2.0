import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulates checking the Google OAuth code, then redirects to the main app dashboard
    const timer = setTimeout(() => {
      navigate('/employees');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
        {/* Animated Custom Loading Spinner Ring */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
        
        {/* Typography Context */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Authenticating...
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Please wait while we verify your login with Google OAuth.
        </p>
      </div>
    </div>
  );
}