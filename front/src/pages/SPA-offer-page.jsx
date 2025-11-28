import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "../components/Reviews";
import { useUser } from "../contexts/UserContext";
import Calendar from "react-calendar";

export default function SpaOffers() {
  const [spaData, setSpaData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedHoursByDay, setReservedHoursByDay] = useState({});

  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  useEffect(() => {
    if (!user) return;

    const fetchSpa = async () => {
      try {
        const spaRes = await axios.get("http://localhost:3000/spa");

        const flat = [];
        let globalIndex = 0;

        spaRes.data.forEach((category) => {
          (category.offer || []).forEach((item) => {
            flat.push({
              id: `${category.id}-${globalIndex + 1}`,
              name: item.name,
              price: item.price,
              img: category.img,
              categoryTitle: category.title,
              hours: category.hours,
              offerIndex: globalIndex,
              categoryId: category.id,
              rawPriceNumber: item.price
                ? Number(String(item.price).replace(/[^0-9]/g, ""))
                : null,
            });
            globalIndex++;
          });
        });

        setSpaData(flat);

        if (flat.length > 0 && location.state?.offerId) {
          const offer = flat.find((o) => o.id === location.state.offerId);
          if (offer) setSelectedOffer(offer);
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        console.error("Błąd pobierania danych SPA:", err);
      }
    };

    fetchSpa();
  }, [user, location.state, navigate, location.pathname]);

  useEffect(() => {
    if (!selectedOffer) return;

    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/reservations/spa/${selectedOffer.id}`
        );

        const grouped = {};

        res.data.forEach((r) => {
          const d = new Date(r.date);
          const dayKey = `${d.getFullYear()}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

          if (!grouped[dayKey]) grouped[dayKey] = [];

          const h =
            typeof r.hour === "number"
              ? String(r.hour).padStart(2, "0") + ":00"
              : r.hour;
          grouped[dayKey].push(h);
        });

        console.log("Grouped reservations:", grouped);
        setReservedHoursByDay(grouped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReservations();
  }, [selectedOffer]);

  const getOfferHours = () => {
    if (!selectedOffer) return [];
    const [start, end] = selectedOffer.hours.split("–").map((h) => h.trim());
    const toMin = (t) => {
      const [H, M] = t.split(":");
      return +H * 60 + +M;
    };
    const from = toMin(start);
    const to = toMin(end);

    const hours = [];
    for (let m = from; m <= to; m += 120) {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      hours.push(`${hh}:${mm}`);
    }
    return hours;
  };

  const isDateOccupied = (date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

    const reserved = reservedHoursByDay[key] || [];
    const total = getOfferHours().length;

    return reserved.length >= total;
  };

  if (!user) navigate("/login");

  const filteredOffers = spaData
    .filter(
      (offer) =>
        (offer.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (offer.categoryTitle || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const na = a.rawPriceNumber ?? Infinity;
      const nb = b.rawPriceNumber ?? Infinity;
      return sortOrder === "asc" ? na - nb : nb - na;
    });

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Oferty SPA
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <input
          type="text"
          placeholder="Szukaj zabiegu lub kategorii..."
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
          <option value="none">Brak sortowania</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={offer.img}
              alt={offer.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h3 className="text-sm text-gray-500 mb-1">
                {offer.categoryTitle}
              </h3>
              <h2 className="text-2xl font-semibold mb-2">{offer.name}</h2>
              <p className="text-gray-600 mb-2">Godziny: {offer.hours}</p>

              <p className="font-semibold mb-3">
                {offer.price ? `Cena: ${offer.price} PLN` : "W cenie wejścia"}
              </p>

              <div className="flex gap-2">
                <button
                  className="flex-1 cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setSelectedOffer(offer)}
                >
                  Dowiedz się więcej
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOffer && (
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
                onClick={() => setSelectedOffer(null)}
              >
                &times;
              </button>

              <div className="md:w-1/2 flex-shrink-0">
                <img
                  src={selectedOffer.img}
                  alt={selectedOffer.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="md:w-1/2 flex flex-col">
                <h2 className="text-3xl font-bold mb-4">
                  {selectedOffer.name} —{" "}
                  {selectedOffer.price || "W cenie wejścia"}
                </h2>
                <p className="text-gray-700 mb-4">
                  Kategoria: {selectedOffer.categoryTitle}
                </p>

                <div className="mb-4 flex flex-col items-center">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDetail="month"
                    maxDetail="month"
                    selectRange={false}
                    tileDisabled={({ date }) => disablePastDates(date)}
                  />

                  <h3 className="text-2xl font-semibold mb-2">
                    Wybierz godzinę
                  </h3>
                  {selectedDate && selectedOffer && (
                    <select
                      className="px-4 py-2 rounded-lg border border-gray-300"
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                    >
                      <option value="">Wybierz godzinę</option>
                      {getOfferHours().map((hour) => {
                        const dayKey = selectedDate.toISOString().slice(0, 10);
                        const reserved = reservedHoursByDay[dayKey] || [];
                        const isOccupied = reserved.includes(hour);

                        return (
                          <option key={hour} value={hour} disabled={isOccupied}>
                            {hour} {isOccupied ? "(zajęte)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                <button
                  className={`w-full py-2 rounded-lg mb-4 transition 
    ${
      !selectedDate || !selectedHour
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
    }`}
                  onClick={() => {
                    navigate("/rezerwacja/spa", {
                      state: {
                        offerId: selectedOffer.id,
                        selectedHour: selectedHour,
                        selectedDate: selectedDate,
                      },
                    });
                  }}
                  disabled={!selectedDate || !selectedHour}
                >
                  Zarezerwuj
                </button>

                <div>
                  <h3 className="text-2xl font-semibold mb-2">Opinie</h3>
                  <Reviews
                    type="spa"
                    id={
                      selectedOffer
                        ? `${selectedOffer.categoryId}-${
                            selectedOffer.offerIndex + 1
                          }`
                        : null
                    }
                    selectedOffer={selectedOffer}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
