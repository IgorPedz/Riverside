import { useState } from "react";

export default function TopUpModal({ isOpen, onClose, onTopUp }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Podaj prawidłową kwotę większą od 0");
      return;
    }
    setError("");
    onTopUp(numAmount);
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Doładuj konto</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Kwota w PLN"
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Doładuj
          </button>
        </div>
      </div>
    </div>
  );
}
