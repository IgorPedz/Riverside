export default function About() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      <img
        src="../hotel-pic-2.jpg"
        className="rounded-xl shadow-lg"
      />

      <div>
        <h2 className="text-3xl font-bold mb-4">Dlaczego warto wybrać nas?</h2>
        <p className="text-gray-600 mb-6">
          Hotel Riverside to połączenie luksusu, komfortu i wyjątkowej lokalizacji otoczonej naturą.
        </p>

        <ul className="space-y-3">
          <li>⭐ 5-gwiazdkowy standard</li>
          <li>🌿 Położenie wśród zieleni</li>
          <li>🛎 Recepcja 24/7</li>
        </ul>
          <button className="mt-2 p-2 cursor-pointer bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ">
            Dowiedz się wiecej
          </button>
      </div>
    </section>
  );
}
