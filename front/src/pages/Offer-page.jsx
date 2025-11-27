export default function OffersPage() {
  return (
    <div className="bg-gray-50 text-gray-800 bg-decor-soft">
      <section className="relative h-72 md:h-96 w-full">
        <img
          src="../public/hotel-pic-7.png"
          className="w-full h-full object-cover"
          alt="Hotel"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl font-light tracking-wide">
            Poznaj nasze oferty
          </h1>
          <p className="text-lg opacity-80 mt-2">
            Wybierz kategorię, która najbardziej Cię interesuje
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        {/* Noclegi */}
        <CategoryCard
          title="Noclegi"
          img="../public/room-pic-2.jpg"
          desc="Komfortowe pokoje, apartamenty i pakiety pobytowe."
          to="/oferty/noclegi"
        />

        {/* SPA */}
        <CategoryCard
          title="SPA"
          img="../public/SPA-offer-3.jpg"
          desc="Zabiegi relaksacyjne, masaże i pełna strefa wellness."
          to="/oferty/spa"
        />
      </section>
    </div>
  );
}

function CategoryCard({ title, img, desc, to }) {
  return (
    <a
      href={to}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-110 hover:shadow-xl transition"
    >
      <img src={img} className="w-full h-48 object-cover" alt={title} />

      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-500 mt-2">{desc}</p>
        <span className="text-blue-600 mt-4 inline-block font-medium">
          Zobacz ofertę →
        </span>
      </div>
    </a>
  );
}
