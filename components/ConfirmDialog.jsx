import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({
  open,
  title = "Potwierdź działanie",
  message = "Czy na pewno chcesz to zrobić?",
  confirmLabel = "Potwierdź",
  cancelLabel = "Anuluj",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => (document.body.style.overflow = "unset");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                     flex items-center justify-center pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 w-80 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                {cancelLabel}
              </button>

              <button
                onClick={onConfirm}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
