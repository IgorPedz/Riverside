import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ErrorMessage({ header, message, autoClose = 3000 }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (message) {
      setShowModal(true);

      if (autoClose) {
        const timer = setTimeout(() => setShowModal(false), autoClose);
        return () => clearTimeout(timer);
      }
    }
  }, [message, autoClose]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 pt-10 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center"
          >
            {header && <h2 className="text-xl font-bold mb-2">{header}</h2>}
            <p className="mb-4">{message}</p>
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
  );
}
