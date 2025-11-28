import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";

export default function SpaReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const { offerId, selectedDate, selectedHour } = location.state || {};

  const [offer, setOffer] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const generateReservationCode = () => {
    let code = "";
    for (let i = 0; i < 12; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  };

  useEffect(() => {
    if (!offerId) return;

    const fetchOffer = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/spa/${offerId}`);
        setOffer(res.data);
        
      } catch (err) {
        console.error("Błąd pobierania oferty SPA:", err);
      }
    };

    fetchOffer();
  }, [offerId]);

  useEffect(() => {
    setCode(generateReservationCode());
  }, []);

  if (!offer) return <p>Ładowanie oferty SPA...</p>;
  if (!selectedDate || !selectedHour) return <p>Nie wybrano daty lub godziny rezerwacji</p>;

  const handlePayment = async () => {
    try {
      await axios.post("http://localhost:3000/api/spa/reservations", {
        spaOfferId: offer.id,
        categoryId: offer.categoryId,
        userId: user.id,
        date: selectedDate.toISOString().split("T")[0],
        hour: selectedHour,
        price: offer.price,
        code,
      });
      navigate("/", { state: { reservationSuccess: true } });
    } catch (err) {
      console.error("Błąd przy tworzeniu rezerwacji SPA:", err);
      setError("Za mało środków na koncie!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10 flex justify-center">
      {error && <ErrorMessage header="Błąd Rezerwacji SPA" message={error} />}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-2/3">
        <h1 className="text-3xl font-bold mb-4">Podsumowanie rezerwacji SPA</h1>
        <p className="mb-2">
          <span className="font-semibold">Oferta:</span> {offer.name}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Kategoria:</span> {offer.categoryTitle}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Data:</span> {selectedDate.toLocaleDateString()}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Godzina:</span> {selectedHour}
        </p>
        <p className="mb-4 font-semibold">Cena: {offer.price} PLN</p>
        <p>Twój numer rezerwacji: {code}</p>
        <button
          onClick={handlePayment}
          className="cursor-pointer w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Zapłać teraz
        </button>
      </div>
    </div>
  );
}
