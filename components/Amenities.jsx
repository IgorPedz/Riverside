import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Amenities() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [udogodnienia, setUdogodnienia] = useState([]);
  const carouselRef = useRef(null);

  // Swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) {
      setSelectedIndex((prev) => (prev + 1) % udogodnienia.length);
    } else if (delta < -50) {
      setSelectedIndex((prev) => (prev - 1 + udogodnienia.length) % udogodnienia.length);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/udogodnienia");
        setUdogodnienia(res.data);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (udogodnienia.length > 0)
        setSelectedIndex((prev) => (prev + 1) % udogodnienia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [udogodnienia.length]);

  useEffect(() => {
    if (!carouselRef.current || udogodnienia.length === 0) return;
    const selectedCard = carouselRef.current.children[selectedIndex];
    if (!selectedCard) return;

    const carouselRect = carouselRef.current.getBoundingClientRect();
    const cardRect = selectedCard.getBoundingClientRect();

    const offset = cardRect.left - carouselRect.left - (carouselRect.width / 2 - cardRect.width / 2);

    carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
  }, [selectedIndex, udogodnienia]);

  if (udogodnienia.length === 0) return <p>Ładowanie udogodnień...</p>;

  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headers">
        Udogodnienia hotelu
      </h2>

      <motion.div
        key={udogodnienia[selectedIndex].id}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden mb-12 flex flex-row items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <img
          src={udogodnienia[selectedIndex].image}
          alt={udogodnienia[selectedIndex].name}
          className="w-full md:w-100 h-20 md:h-auto object-cover"
        />
        <div className="p-6 md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">{udogodnienia[selectedIndex].name}</h3>
          <p className="text-gray-700">{udogodnienia[selectedIndex].description}</p>
        </div>
      </motion.div>

      <div
        ref={carouselRef}
        className="max-w-6xl mx-auto flex space-x-4 overflow-x-auto pb-4 px-15 no-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {udogodnienia.map((item, index) => (
          <motion.div
            key={item.id}
            className={`flex-shrink-0 w-40 md:w-48 p-4 rounded-xl shadow-lg cursor-pointer text-center ${
              index === selectedIndex ? "bg-white scale-105 shadow-2xl" : "bg-gray-200"
            }`}
            whileHover={{ scale: 1.08, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
            <h4 className="font-semibold text-sm md:text-base">{item.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
