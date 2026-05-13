import { HiOutlineLogout } from "react-icons/hi";

function Navbar() {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6">
      
      <h1 className="text-xl font-bold text-primary">
        HopeHRS
      </h1>

      <div className="flex items-center gap-4">
        
        <div className="text-sm text-gray-600">
          Welcome,{" "}
          <span className="font-semibold text-primary">
            HR Manager
          </span>
        </div>

        <button className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-all">
          
          <HiOutlineLogout />

          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;