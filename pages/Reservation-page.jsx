import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const { roomId, selectedRange } = location.state || {};
  const [room, setRoom] = useState(null);
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
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/rooms/${roomId}`
        );
        setRoom(res.data);
        console.log(room);
      } catch (err) {
        console.error("Błąd pobierania pokoju:", err);
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    const reservationCode = Number(generateReservationCode());
    setCode(reservationCode);
  }, []);
  if (!room) return <p>Ładowanie pokoju...</p>;
  if (!selectedRange || selectedRange.length < 2)
    return <p>Nie wybrano okresu rezerwacji</p>;

  const [startDate, endDate] = selectedRange;
  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = nights * room.price;

  const handlePayment = async () => {
    try {
      await axios.post("http://localhost:3000/api/reservations", {
        roomId: Number(room.room_id),
        userId: Number(user.id),
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        totalPrice,
        code,
      });
      navigate("/", { state: { reservationSuccess: true } });
    } catch (err) {
      setError("Za mało środków na koncie!");
      console.error("Błąd przy tworzeniu rezerwacji:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10 flex justify-center">
       {error && <ErrorMessage header="Błąd Rezerwacji" message={error} />}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-2/3">
        <h1 className="text-3xl font-bold mb-4">Podsumowanie rezerwacji</h1>
        <p className="mb-2">
          <span className="font-semibold">Pokój:</span> {room.name}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Okres rezerwacji:</span>{" "}
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} (
          {nights} noc{nights > 1 ? "e" : ""})
        </p>
        <p className="mb-4 font-semibold">Cena za noc: {room.price} PLN</p>
        <p className="mb-6 text-xl font-bold">Łączna cena: {totalPrice} PLN</p>

        <h2 className="text-2xl font-semibold mb-2">Pozostałe dane pokoju:</h2>
        <table className="w-full mb-4 border border-gray-200">
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-semibold">
                Dostępność dla niepełnosprawnych
              </td>
              <td className="p-2">{room.accessible ? "Tak" : "Nie"}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold">Śniadanie w cenie</td>
              <td className="p-2">{room.breakfast ? "Tak" : "Nie"}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-semibold">Zwierzęta domowe</td>
              <td className="p-2">{room.pets ? "Tak" : "Nie"}</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold">Parking</td>
              <td className="p-2">{room.parking ? "Tak" : "Nie"}</td>
            </tr>
          </tbody>
        </table>
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
