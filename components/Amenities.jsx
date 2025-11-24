import { useState } from "react";

export default function Amenities() {
  const items = [
    {
      name: "Basen kryty",
      description:
        "Nasz basen kryty jest przestronny, podgrzewany i dostępny przez cały rok. Idealny zarówno do relaksu, jak i aktywnego pływania. Dla dzieci przygotowaliśmy specjalną część z bezpieczną głębokością, a dla dorosłych strefę do pływania rekreacyjnego i treningowego.",
      image: "../basen-pic-1.jpg",
    },
    {
      name: "SPA",
      description:
        "Relaksujące SPA oferuje szeroką gamę zabiegów: masaże, saunę fińską, jacuzzi oraz aromaterapię. Nasze profesjonalne masażystki zadbają o Twój komfort i odprężenie, a strefa relaksu pozwoli na pełne odłączenie się od codziennego stresu.",
      image: "../SPA-pic-2.jpg",
    },
    {
      name: "Restauracja",
      description:
        "Nasza restauracja serwuje zarówno lokalne przysmaki, jak i dania kuchni międzynarodowej, przygotowywane ze świeżych, sezonowych składników. Goście mogą delektować się wykwintnymi potrawami w eleganckim, przytulnym wnętrzu z widokiem na ogród lub taras.",
      image: "../Restaurant-pic-2.jpg",
    },
    {
      name: "Parking",
      description:
        "Oferujemy przestronny parking dla naszych gości, dostępny 24/7, monitorowany i bezpieczny. Dzięki wygodnemu położeniu, możesz szybko dotrzeć do recepcji lub windy, a Twoje auto będzie zawsze pod opieką.",
      image: "../Parking-pic-1.jpg",
    },
    {
      name: "Wi-Fi",
      description:
        "Szybkie i stabilne Wi-Fi dostępne w całym hotelu pozwala na komfortową pracę zdalną, streaming filmów czy przeglądanie internetu. Niezależnie od tego, czy korzystasz z laptopa, tabletu czy smartfona, połączenie jest zawsze niezawodne.",
      image: "../WiFi-pic-1.png",
    },
    {
      name: "Siłownia",
      description:
        "Nowoczesna siłownia jest w pełni wyposażona w sprzęt cardio, wolne ciężary oraz maszyny do treningu siłowego i funkcjonalnego. Dla osób, które lubią indywidualne treningi, przygotowaliśmy plan ćwiczeń i porady naszych trenerów.",
      image: "../Gym-pic-1.jpg",
    },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-xl font-bold text-center mb-8">Udogodnienia hotelu</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
        {items.map((item) => (
          <div
            key={item.name}
            className="text-lg font-medium p-6 bg-white hover:bg-gray-200 shadow rounded-lg cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {item.name}
          </div>
        ))}
      </div>

  {selectedItem && (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
          onClick={() => setSelectedItem(null)}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-4">{selectedItem.name}</h3>
        <img
          src={selectedItem.image}
          alt={selectedItem.name}
          className="w-full h-60 object-cover mb-4 rounded"
        />
        <p className="text-gray-700">{selectedItem.description}</p>
      </div>
    </div>
  )}

    </section>
  );
}
