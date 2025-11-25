import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Spa() {
  const [openMenu, setOpenMenu] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/spa");
        setCategories(res.data);
      } catch (err) {
        console.error("Błąd pobierania SPA:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="mt-10 max-w-10xl mx-auto px-4 py-16 bg-decor-soft">
      <section className="py-20 px-6 md:px-10 max-w-5xl mx-auto text-center relative z-10">
        <h1 className="font-display text-6xl font-bold text-center mb-14">
          SPA & Wellness
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
          {" "}
          Odkryj oazę spokoju w naszym luksusowym SPA & Wellness. Elegancka
          przestrzeń, nastrojowe światło i zapach naturalnych olejków pozwolą Ci
          oderwać się od codzienności.{" "}
        </p>{" "}
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
          {" "}
          Oferujemy masaże wykonywane przez profesjonalnych terapeutów,
          kompleksową strefę saun oraz zabiegi pielęgnacyjne premium, które
          przywracają harmonię ciału i umysłowi. Zafunduj sobie chwilę dla
          siebie — zasługujesz na to.{" "}
        </p>
        <Link to="/oferty/spa">
          <div className="inline-block px-10 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer">
            Zarezerwuj zabieg
          </div>
        </Link>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-10">
        <div></div>
        {categories.map((categorie) => (
          <div
            key={categorie.id}
            className="relative rounded-2xl overflow-hidden shadow-lg group bg-white"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={categorie.img}
                alt={categorie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>

              <button
                onClick={() => setOpenMenu(categorie)}
                className="cursor-pointer absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-lg shadow opacity-0
                group-hover:opacity-100 transition-all duration-300 hover:bg-gray-200"
              >
                Pokaż menu
              </button>
            </div>

            <div className="bg-gray-100 text-center py-5 px-3">
              <h2 className="text-2xl font-semibold">{categorie.title}</h2>
              <p className="text-gray-600 mt-1">{categorie.hours}</p>
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
              {openMenu.title}
            </h2>
            <p className="text-center text-gray-500 mb-6">{openMenu.hours}</p>

            <ul className="space-y-3">
              {openMenu.offer.map((item, i) => (
                <li key={i} className="text-lg text-gray-700 border-b pb-2">
                  {item.price ? `${item.name} – ${item.price}` : item.name}
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
        </div>
      )}
      <div></div>
    </section>
  );
}
