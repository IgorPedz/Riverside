import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Gallery() {
  const images = [
    "../hotel-pic-3.jpg",
    "../hotel-pic-4.jpg",
    "../hotel-pic-5.jpg",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427"
  ];

  const containerRef = React.useRef(null);

  const scroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const amount = 320 * direction; 
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-gray-100 relative">
      <h2 className="text-3xl font-bold text-center mb-10">Galeria</h2>

      <div className="relative max-w-6xl mx-auto flex items-center">

        <button
          className="hidden md:flex bg-white/90 shadow-lg w-10 h-10 rounded-full justify-center items-center hover:bg-gray-200 transition z-20 mr-2"
          onClick={() => scroll(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div
          ref={containerRef}
          className="overflow-x-auto no-scrollbar flex-1"
        >
          <div className="flex space-x-4 px-2">
            {images.map((img) => (
              <img
                key={img}
                src={img}
                className="rounded-xl shadow object-cover flex-shrink-0 w-64 h-40 sm:w-72 sm:h-44 md:w-80 md:h-48"
              />
            ))}
          </div>
        </div>

        <button
          className="hidden md:flex bg-white/90 shadow-lg w-10 h-10 rounded-full justify-center items-center hover:bg-gray-200 transition z-20 ml-2"
          onClick={() => scroll(1)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

    </section>
  );
}