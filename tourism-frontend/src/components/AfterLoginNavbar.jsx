import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function AfterLoginNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Destination", path: "/destination" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const linkStyle = ({ isActive }) =>
    `block transition-colors duration-200 ${
      isActive
        ? "text-emerald-800 font-semibold"
        : "text-gray-700 hover:text-emerald-800"
    }`;

  return (
    <nav className="bg-[#E8F0E8] border-b border-[#D5E3D5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

         <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-xl text-white">
                       <img className="h-5 w-5" src="./star.png"></img>
                     </div>
         
                     <div>
                       <h1 className="text-lg font-extrabold">
                         Wander<span className="text-emerald-700">Wise</span>
                       </h1>
                       <p className="text-[10px] uppercase tracking-[2px] text-gray-500">
                         Tourism Recommendation System
                       </p>
                     </div>
                   </div>
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={linkStyle}
              >
                {item.name}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="bg-emerald-800 text-white px-5 py-2 rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-emerald-900 text-2xl p-2"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-[#D5E3D5] py-4 space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMenuOpen(false)}
                className={linkStyle}
              >
                {item.name}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="w-full bg-emerald-800 text-white px-5 py-2.5 rounded-lg hover:cursor-pointer hover:bg-emerald-900  transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AfterLoginNavbar;