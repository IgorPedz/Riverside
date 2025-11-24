import { useState, useEffect, useRef } from "react";

const rooms = [
  { name: "Pokój Deluxe", price: "420 zł / noc", img: "../room-pic-1.jpg" },
  { name: "Apartament Royal", price: "690 zł / noc", img: "../room-pic-2.jpg" },
  { name: "Pokój Standard", price: "299 zł / noc", img: "../room-pic-3.jpg" },
  { name: "Pokój Superior", price: "520 zł / noc", img: "../room-pic-4.jpg" },
  { name: "Apartament Executive", price: "780 zł / noc", img: "../room-pic-5.jpg" },
];

export default function RoomsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const containerRef = useRef(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % rooms.length);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const activeSlide = container.children[currentIndex];
    if (activeSlide) {
      const containerCenter = container.offsetWidth / 2;
      const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
      const scrollLeft = slideCenter - containerCenter;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">Noclegi</h2>
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-4 px-2 sm:px-4 no-scrollbar"
      >
        {rooms.map((room, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={room.name}
              className={`flex-shrink-0 rounded-xl shadow-lg transition-transform duration-500 ease-in-out
                ${isActive ? "scale-105 opacity-100 z-10" : "scale-90 opacity-50 z-0"}
              `}
              style={{ minWidth: "250px" }}
            >
              <img
                src={room.img}
                alt={room.name}
                className="w-64 sm:w-72 md:w-80 lg:w-96 h-56 sm:h-60 md:h-64 lg:h-72 object-cover rounded-t-xl"
              />
              <div className="p-4 text-center bg-white rounded-b-xl shadow-inner">
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="text-gray-500">{room.price}</p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Zobacz szczegóły
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 bg-white/80 hover:bg-white/100 rounded-full p-3 shadow-lg"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 bg-white/80 hover:bg-white/100 rounded-full p-3 shadow-lg"
      >
        &#8594;
      </button>
    </div>
  );
}
