import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "../components/Reviews";
import { useUser } from "../contexts/UserContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AccommodationOffers() {
  const [roomsData, setRoomsData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [favoritesMap, setFavoritesMap] = useState({});

  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [reservations, setReservations] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [selectedRange, setSelectedRange] = useState([null, null]);

  useEffect(() => {
    if (!user) return;
    const fetchRoomsAndFavorites = async () => {
      try {
        const roomsRes = await axios.get("http://localhost:3000/api/rooms");
        setRoomsData(roomsRes.data);
        const favRes = await axios.get(
          `http://localhost:3000/api/favourites/${user.id}`
        );
        const favMap = {};
        favRes.data.forEach((fav) => {
          favMap[fav.fav_id] = true;
        });
        setFavoritesMap(favMap);

        if (roomsRes.data.length > 0 && location.state?.roomId) {
          const room = roomsRes.data.find(
            (r) => r.id === location.state.roomId
          );
          if (room) setSelectedRoom(room);
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      }
    };
    fetchRoomsAndFavorites();
  }, [user, location.state?.roomId, navigate, location.pathname]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedRoom) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/rooms/${selectedRoom.id}/reservations`
        );
        setReservations(res.data);

        const occupied = [];
        res.data.forEach((r) => {
          const start = new Date(r.start_date);
          const end = new Date(r.end_date);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            occupied.push(new Date(d));
          }
        });
        setOccupiedDates(occupied);
      } catch (err) {
        console.error("Błąd pobierania rezerwacji:", err);
      }
    };
    fetchReservations();
    setSelectedRange([null, null]);
    setOccupiedDates([]);
  }, [selectedRoom]);

  if (!user) navigate("/login");

  const isDateOccupied = (date) =>
    occupiedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );

  const filteredRooms = roomsData
    .filter((room) => room.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const toggleFavorite = async (roomId) => {
    if (!user) return;
    try {
      if (favoritesMap[roomId]) {
        // Usuń z ulubionych
        await axios.delete(
          `http://localhost:3000/api/favourites/${user.id}/${roomId}`
        );
        setFavoritesMap((prev) => ({ ...prev, [roomId]: false }));
      } else {
        // Dodaj do ulubionych
        await axios.post("http://localhost:3000/api/favourites", {
          userId: user.id,
          roomId,
        });
        setFavoritesMap((prev) => ({ ...prev, [roomId]: true }));
      }
    } catch (err) {
      console.error("Błąd zmiany ulubionych:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Nasze noclegi
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <input
          type="text"
          placeholder="Szukaj pokoju..."
          className="px-4 py-2 rounded-lg border border-gray-300 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Cena: od najniższej</option>
          <option value="desc">Cena: od najwyższej</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <button
              onClick={() => toggleFavorite(room.id)}
              className="cursor-pointer absolute top-3 right-3 text-2xl z-10"
            >
              <span
                className={`${
                  favoritesMap[room.id] ? "text-yellow-400" : "text-gray-300"
                } transition-colors`}
              >
                ★
              </span>
            </button>

            <img
              src={room.img}
              alt={room.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600 mb-2">{room.short_desc}</p>

              <p className="font-semibold mb-3">Cena: {room.price} PLN / noc</p>
              <button
                className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => setSelectedRoom(room)}
              >
                Dowiedz się więcej
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full md:w-4/5 lg:w-3/4 rounded-2xl overflow-y-auto max-h-[90vh] relative p-6 flex flex-col md:flex-row gap-6"
            >
              <button
                className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-50"
                onClick={() => setSelectedRoom(null)}
              >
                &times;
              </button>

              <div className="md:w-1/2 flex-shrink-0">
                <img
                  src={selectedRoom.img}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="md:w-1/2 flex flex-col">
                <h2 className="text-3xl font-bold mb-4">{selectedRoom.name} ---- {selectedRoom.price} PLN / noc</h2>
                <p className="text-gray-700 mb-4">{selectedRoom.long_desc}</p>

                <table className="w-full mb-4 border border-gray-200">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-semibold">
                        Dostępność dla niepełnosprawnych
                      </td>
                      <td className="p-2">
                        {selectedRoom.conditions.accessible ? "Tak" : "Nie"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Śniadanie w cenie</td>
                      <td className="p-2">
                        {selectedRoom.conditions.breakfast ? "Tak" : "Nie"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Zwierzęta domowe</td>
                      <td className="p-2">
                        {selectedRoom.conditions.pets ? "Tak" : "Nie"}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Parking</td>
                      <td className="p-2">
                        {selectedRoom.conditions.parking ? "Tak" : "Nie"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mb-4 flex justify-center flex-col items-center">
                  <h3 className="text-2xl font-semibold mb-2">Dostępność</h3>
                  <Calendar
                    selectRange={true}
                    onChange={(range) => setSelectedRange(range)}
                    tileDisabled={({ date }) =>
                      disablePastDates(date) || isDateOccupied(date)
                    }
                  />
                </div>

                <button
                  className={`w-full py-2 rounded-lg text-white transition mb-4 ${
                    !selectedRange || !selectedRange[0]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => {
                    if (!selectedRange || !selectedRange[0]) {
                      return;
                    }

                    navigate("/rezerwacja", {
                      state: {
                        roomId: selectedRoom.id,
                        selectedRange: selectedRange,
                      },
                    });
                  }}
                >
                  Zarezerwuj
                </button>

                <div>
                  <h3 className="text-2xl font-semibold mb-2">Opinie</h3>
                  <Reviews type="rooms" id={selectedRoom.id} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
