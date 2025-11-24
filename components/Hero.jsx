export default function Hero() {
  return (
    <header className="relative h-screen bg-[url('../hotel-pic-1.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        <h1 className="font-display text-9xl">Witamy w Riverside</h1>
        <p className="text-xl mb-8">Luksusowy wypoczynek w sercu natury</p>

        <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-700 w-full max-w-xl">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="date" className="cursor-pointer p-3 rounded-md border" />
            <input type="date" className="cursor-pointer p-3 rounded-md border" />
            <button className="cursor-pointer bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
              Sprawdź dostępność
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
