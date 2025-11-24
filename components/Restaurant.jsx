export default function Restaurant() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src="../Restaurant-pic-1.jpg"
          className="rounded-xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">Restauracja</h2>
          <p className="text-gray-600 mb-6">
            Nasz szef kuchni przygotowuje dania inspirowane smakami regionu.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Zobacz menu
          </button>
        </div>
      </div>
    </section>
  );
}
