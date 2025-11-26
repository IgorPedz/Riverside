import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RestaurantPage() {
  const [openMenu, setOpenMenu] = useState(null);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get("http://localhost:3000/meals");
        setMeals(res.data);
      } catch (err) {
        console.error("Błąd pobierania posiłków:", err);
      }
    };
    fetchMeals();
  }, []);

  return (
    <section className="mt-10 max-w-10xl mx-auto px-4 py-16 bg-decor-soft">
      <section className="py-20 px-6 md:px-10 max-w-5xl mx-auto text-center relative z-10">
        <div className="grid gap-10 bg-white/100 p-10 text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
          <h1 className="font-display text-6xl font-bold text-center mb-14">
            Restauracja Hotelowa
          </h1>
          <p>
            Zanurz się w świecie, w którym smak spotyka elegancję, a perfekcja
            podania dopełnia wyjątkową atmosferę. Nasza restauracja to miejsce
            stworzone dla tych, którzy szukają czegoś więcej niż zwykłego
            posiłku — oferujemy kulinarne doświadczenie, które celebruje każdą
            chwilę. Codziennie serwujemy dania inspirowane lokalnymi produktami
            i międzynarodowymi trendami kulinarnymi, tworząc unikalne połączenia
            smaków. Nasz szef kuchni dba o to, aby każde danie było opowieścią —
            starannie skomponowaną, pełną aromatu i elegancji. Wnętrze
            restauracji otula ciepłym światłem, a panoramiczne przeszklenia
            pozwalają podziwiać otaczającą hotel naturę, tworząc idealne tło do
            romantycznych kolacji, rodzinnych spotkań czy biznesowych obiadów.
          </p>
          <Link to="/oferty/restauracja">
            <div className="inline-block px-10 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer">
              Zarezerwuj miejsce
            </div>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        <div className="m:hidden"></div>
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="relative rounded-2xl overflow-hidden shadow-lg group bg-white"
          >
            <div className="relative"></div>
            <div className="relative h-64 overflow-hidden">
              <img
                src={meal.img}
                alt={meal.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>

              <button
                onClick={() => setOpenMenu(meal)}
                className="cursor-pointer absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-lg shadow opacity-0
                group-hover:opacity-100 transition-all duration-300 hover:bg-gray-200"
              >
                Pokaż menu
              </button>
            </div>

            <div className="bg-gray-100 text-center py-5 px-3">
              <h2 className="text-2xl font-semibold">{meal.name}</h2>
              <p className="text-gray-600 mt-1">{meal.hours}</p>
            </div>
          </div>
        ))}
      </div>

      {openMenu && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl relative">
            <button
              className="cursor-pointer absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black"
              onClick={() => setOpenMenu(null)}
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-2 text-center">
              {openMenu.name}
            </h2>
            <p className="text-center text-gray-500 mb-6">{openMenu.hours}</p>

            <ul className="space-y-3">
              {openMenu.menu.map((item, i) => (
                <li key={i} className="text-lg text-gray-700 border-b pb-2">
                  {item.name ? `${item.name} – ${item.price}` : item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setOpenMenu(null)}
              className="cursor-pointer mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Zamknij
            </button>
          </div>
          <div></div>
        </div>
      )}
      <div></div>
    </section>
  );
}
