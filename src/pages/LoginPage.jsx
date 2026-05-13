<div className="min-h-screen flex bg-[#F4F7FA]">
  
  {/* Left Branding */}
  <div className="hidden lg:flex w-1/2 bg-[#1B263B] items-center justify-center">
    <div className="text-center">
      <img src="/logo.png" className="w-72 mx-auto" />
      <h1 className="text-4xl font-bold text-white mt-6">
        HOPE Inc
      </h1>
      <p className="text-[#59ABBD] mt-2">
        Human Resource System
      </p>
    </div>
  </div>

  {/* Login Form */}
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
      
      <h2 className="text-3xl font-bold text-[#1B263B]">
        Welcome Back
      </h2>

      <form className="mt-8 space-y-5">

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl px-4 py-3"
        />

        <button className="w-full bg-[#59ABBD] text-white py-3 rounded-xl">
          Login
        </button>

      </form>

    </div>
  </div>
</div>