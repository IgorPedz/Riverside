import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state?.reservationSuccess) {
      setShowModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal, setShowModal]);

  return (
    <header className="relative h-screen bg-[url('../hotel-pic-1.jpg')] bg-cover bg-center">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 inset-0 bg-black/40 flex justify-center  z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 bg-white p-6 rounded-xl shadow-lg max-w-sm text-center"
            >
              <h2 className="text-xl font-bold mb-2">Rezerwacja zakończona!</h2>
              <p className="mb-4">
                Twoja rezerwacja została pomyślnie zapisana.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Zamknij
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        <h1 className="font-display text-9xl">Witamy w Riverside</h1>
        <p className="text-xl mb-8">Luksusowy wypoczynek w sercu natury</p>

        <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-700 w-full max-w-xl">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              className="cursor-pointer p-3 rounded-md border"
            />
            <input
              type="date"
              className="cursor-pointer p-3 rounded-md border"
            />
            <button className="cursor-pointer bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
              Sprawdź dostępność
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
