import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

import ConfirmDialog from "./ConfirmDialog.jsx";

export default function Navbar() {
  const { user, logout } = useUser() ?? {};
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
        className={`fixed top-0 w-full z-40 transition-transform duration-500 ease-in-out backdrop-blur-md bg-white/60 ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={{ transform: collapsed ? `translateY(-100%)` : `translateY(0)` }}
      >
        <div className="max-w-8xl mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 h-16">
            <img
              src="../logo.png"
              alt="Riverside Logo"
              className="h-25 w-auto"
            />
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">
              Strona główna
            </Link>

            <div className="relative group inline-block">
              <div className="flex items-center gap-1 cursor-pointer">
                <Link to="/oferty" className="hover:text-blue-600 transition">
                  Oferty ▼
                </Link>
              </div>
              <div className="absolute left-0 w-44 h-3 group-hover:block"></div>
              <div
                className="
                  absolute left-0 mt-3 w-44
                  bg-white shadow-lg rounded-lg py-2
                  opacity-0 translate-y-2 pointer-events-none
                  group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                  transition-all duration-200
                "
              >
                <Link
                  to="/oferty/noclegi"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Noclegi
                </Link>
                <Link
                  to="/oferty/restauracja"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Restauracja
                </Link>
                <Link
                  to="/oferty/spa"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  SPA
                </Link>
              </div>
            </div>

            <Link to="/spa" className="hover:text-blue-600 transition">
              SPA & Wellness
            </Link>
            <Link to="/restauracja" className="hover:text-blue-600 transition">
              Restauracja
            </Link>
            <Link to="/o-nas" className="hover:text-blue-600 transition">
              O nas
            </Link>
          </div>

          {/* Profile / Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/rejestracja">
                  <div className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Rejestracja
                  </div>
                </Link>
                <Link to="/login">
                  <div className="cursor-pointer px-4 py-2 border border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                    Logowanie
                  </div>
                </Link>
              </>
            ) : (
              <div
                className="relative group"
                onMouseEnter={() => setProfileHover(true)}
                onMouseLeave={() => setProfileHover(false)}
              >
                <div className="flex items-center space-x-2 px-4 py-2 text-gray-700 font-medium cursor-pointer">
                  <span className="text-3xl">Witaj, {user.nick}</span>
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-gray-700 text-5xl"
                  />
                </div>

                <div className="absolute left-0 w-44 h-3 group-hover:block"></div>
                <div
                  className="
                    absolute right-0 mt-2 w-56
                    bg-white shadow-lg rounded-lg py-2
                    opacity-0 pointer-events-none
                    group-hover:opacity-100 group-hover:pointer-events-auto
                    transition-all duration-200
                    z-50
                  "
                >
                  <Link
                    to="/profil?tab=rezerwacje"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Moje Rezerwacje
                  </Link>
                  <Link
                    to="/profil?tab=ulubione"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Moje Ulubione
                  </Link>
                  <Link
                    to="/profil?tab=konto"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Konto
                  </Link>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="cursor-pointer block w-full text-left px-4 py-2 text-red-500 rounded-lg hover:bg-red-300 transition"
                  >
                    Wyloguj
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden gap-5">
            {/* Hamburger */}
            <button
              className="flex flex-col justify-center items-center space-y-1 cursor-pointer transition-transform duration-300 z-50"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`w-6 h-0.5 bg-blue-700 transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-blue-700 transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-blue-700 transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </button>

            {user && (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 font-medium cursor-pointer"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-blue-700 text-2xl"
                  />
                </button>

                {profileOpen && (
                  <div
                    className="
          absolute right-0 mt-2 w-56
          bg-white shadow-lg rounded-lg py-2
          z-50
        "
                  >
                    <Link
                      to="/profil?tab=rezerwacje"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Moje Rezerwacje
                    </Link>
                    <Link
                      to="/profil?tab=ulubione"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Moje Ulubione
                    </Link>
                    <Link
                      to="/profil?tab=konto"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      Konto
                    </Link>
                    <button
                      onClick={() => setConfirmOpen(true)}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-red-500 hover:bg-red-300 transition"
                    >
                      Wyloguj
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <ConfirmDialog
        open={confirmOpen}
        title="Wylogowanie"
        message="Czy na pewno chcesz się wylogować?"
        confirmLabel="Wyloguj"
        cancelLabel="Anuluj"
        onConfirm={() => {
          logout();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
      {/* Collapse Button */}
      {!menuOpen && !profileOpen && !profileHover && (
        <div
          className="fixed right-1 z-50 transition-top duration-500 ease-in-out"
          style={{ top: `${arrowTop}px` }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer text-3xl p-1 bg-white/60 hover:bg-white/70 text-black rounded-b-full shadow-lg transition"
          >
            {collapsed ? "⮟" : "⮝"}
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                opacity: 1,
                height: "auto",
                transition: { duration: 0.1, ease: "easeOut" },
              },
              closed: {
                opacity: 0,
                height: 0,
                transition: { duration: 0.1, ease: "easeIn" },
              },
            }}
            className="md:hidden fixed top-24 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg flex flex-col p-4 space-y-4 text-gray-700 font-medium z-50"
          >
            <Link
              to="/"
              className="hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Strona główna
            </Link>

            <div className="flex flex-col">
              <button
                onClick={() => setOffersOpen(!offersOpen)}
                className="cursor-pointer flex justify-between items-center w-full hover:text-blue-600 transition"
              >
                Oferty
                <span
                  className={`text-sm transition-transform ${
                    offersOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  offersOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col pl-4 space-y-2">
                  <Link
                    to="/oferty/noclegi"
                    className="hover:text-blue-600 transition"
                    onClick={() => {
                      setMenuOpen(false);
                      setOffersOpen(false);
                    }}
                  >
                    Noclegi
                  </Link>
                  <Link
                    to="/oferty/restauracja"
                    className="hover:text-blue-600 transition"
                    onClick={() => {
                      setMenuOpen(false);
                      setOffersOpen(false);
                    }}
                  >
                    Restauracja
                  </Link>
                  <Link
                    to="/oferty/spa"
                    className="hover:text-blue-600 transition"
                    onClick={() => {
                      setMenuOpen(false);
                      setOffersOpen(false);
                    }}
                  >
                    SPA
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/restauracja"
              className="hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Restauracja
            </Link>
            <Link
              to="/spa"
              className="hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              SPA
            </Link>
            <Link
              to="/o-nas"
              className="hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              O nas
            </Link>

            {!user ? (
              <>
                <Link to="/rejestracja">
                  <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm w-full">
                    Rejestracja
                  </button>
                </Link>
                <Link to="/login">
                  <button className="cursor-pointer px-4 py-2 border border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm w-full">
                    Logowanie
                  </button>
                </Link>
              </>
            ) : (
              <div></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
