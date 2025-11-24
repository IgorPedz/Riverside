import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-8xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-3 h-16">
          <img src="../logo.png" alt="Riverside Logo" className="h-50 w-auto" />
        </div>

        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#home" className="hover:text-blue-600 transition">Strona główna</a>
          <a href="#offers" className="hover:text-blue-600 transition">Oferty</a>
          <a href="#spa" className="hover:text-blue-600 transition">SPA & Wellness</a>
          <a href="#restaurant" className="hover:text-blue-600 transition">Restauracja</a>
          <a href="#about" className="hover:text-blue-600 transition">O nas</a>
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center space-y-1 cursor-pointer transition-transform duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <span className="w-6 h-0.5 bg-blue-700 transition-all duration-300" style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "rotate(0)" }}></span>
          <span className="w-6 h-0.5 bg-blue-700 transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }}></span>
          <span className="w-6 h-0.5 bg-blue-700 transition-all duration-300" style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "rotate(0)" }}></span>
        </button>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">
            Rejestracja
          </button>

          <button className="cursor-pointer px-4 py-2 border border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
            Logowanie
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg flex flex-col p-4 space-y-4 text-gray-700 font-medium border-t">
          <a href="#home" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Strona główna</a>
          <a href="#offers" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Oferty</a>
          <a href="#about" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>O nas</a>
        <a href="#offers" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Oferty</a>
          <a href="#about" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>O nas</a>
          <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm w-full">
            Rejestracja
          </button>

          <button className="cursor-pointer px-4 py-2 border border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm w-full">
            Logowanie
          </button>
        </div>
      )}
    </nav>
  );
}
