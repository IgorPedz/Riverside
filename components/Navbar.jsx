import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
const { user } = useUser() ?? {};
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarHeight = 96;
  const minTop = 0;
  const arrowTop = collapsed ? minTop : navbarHeight;

  return (
    <div className="relative">
      <nav
        className={`fixed top-0 w-full z-40 transition-transform duration-500 ease-in-out backdrop-blur-md bg-white/60 ${scrolled ? "shadow-lg" : ""}`}
        style={{ transform: collapsed ? `translateY(-100%)` : `translateY(0)` }}
      >
        <div className="max-w-8xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-3 h-16">
            <img src="../logo.png" alt="Riverside Logo" className="h-25 w-auto" />
          </div>

          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">Strona główna</Link>
            <a href="#offers" className="hover:text-blue-600 transition">Oferty</a>
            <Link to="/spa" className="hover:text-blue-600 transition">SPA & Wellness</Link>
            <Link to="/restauracja" className="hover:text-blue-600 transition">Restauracja</Link>
            <Link to="/o-nas" className="hover:text-blue-600 transition">O nas</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link to='/rejestracja'>
                  <div className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Rejestracja
                  </div>
                </Link>
                <Link to='/login'>
                  <div className="cursor-pointer px-4 py-2 border border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                    Logowanie
                  </div>
                </Link>
              </>
            ) : (
            <div className="flex items-center space-x-2 px-4 py-2 text-gray-700 font-medium">
              <span className="text-3xl">Witaj, {user.name}</span>
              <FontAwesomeIcon icon={faUser} className="text-gray-700 text-5xl" />
            </div>
            )}
          </div>
            <div className="flex md:hidden gap-5">
              <button
              className="flex flex-col justify-center items-center space-y-1 cursor-pointer transition-transform duration-300 z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              >
              <span
              className={`w-6 h-0.5 bg-blue-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span
              className={`w-6 h-0.5 bg-blue-700 transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
              className={`w-6 h-0.5 bg-blue-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`}
              ></span>
            </button>
          <div>
            <FontAwesomeIcon icon={faUser} className="text-blue-700 text-3xl" />
          </div>
          </div>
        </div>
      </nav>

      {!menuOpen && (
        <div className="fixed right-1 z-50 transition-top duration-500 ease-in-out" style={{ top: `${arrowTop}px` }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer text-3xl p-1 bg-gray-500 hover:bg-gray-400 text-white rounded-b-full shadow-lg hover:bg-blue-700 transition"
          >
            {collapsed ? "⮟" : "⮝"}
          </button>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg flex flex-col p-4 space-y-4 text-gray-700 font-medium border-t mt-20">
        <Link to="/" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Strona główna</Link>
        <a href="#offers" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Oferty</a>
        <Link to="/restauracja" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Restauracja</Link>
        <Link to="/spa" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>SPA</Link>
        <Link to="/o-nas" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>O nas</Link>

    {!user ? (
      <>
        <Link to='/rejestracja'>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm w-full">Rejestracja</button>
        </Link>
        <Link to='/login'>
          <button className="px-4 py-2 border border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm w-full">Logowanie</button>
        </Link>
      </>
    ) : (
      <div></div>
    )}
  </div>
)}

    </div>
  );
}
