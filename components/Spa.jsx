import { Link } from "react-router-dom";

export default function Spa() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 font-headers">
            SPA & Wellness
          </h2>
          <p className="text-gray-600 mb-6">
            Oferujemy masaże, sauny, jacuzzi oraz zabiegi kosmetyczne wykonywane
            przez profesjonalistów.
          </p>
          <Link to="/spa">
            <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Zobacz ofertę SPA
            </button>
          </Link>
        </div>

        <img src="../SPA-pic-1.jpg" className="rounded-xl shadow-lg" />
      </div>
    </section>
  );
}
