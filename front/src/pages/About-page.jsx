export default function About() {
  return (
    <section className="mt-20 max-w-10xl mx-auto px-6 py-20 bg-decor-soft">
      <div className="bg-white/100 p-10 text-gray-700 text-center max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
        <h1 className="font-display text-5xl font-bold text-center mb-10">
          O nas
        </h1>
        <p>Riverside Hotel to miejsce, w którym luksus spotyka się z naturą.
        Powstał z myślą o Gościach, którzy oczekują pełnego komfortu,
        prywatności i wysokiej jakości usług. Każdy detal – od designu wnętrz po
        jakość obsługi – został zaplanowany tak, aby Twój pobyt był nie tylko
        wypoczynkiem, ale</p>
        <span className="font-semibold">wyjątkowym doświadczeniem</span>.
      </div>

      <div className="grid md:grid-cols-2 gap-14 items-center">
        <img
          src="/hotel-pic-1.jpg"
          className="rounded-2xl shadow-xl w-full object-cover"
          alt="Hotel"
        />

        <div className="bg-white/100 p-10">
          <h2 className="text-3xl font-semibold mb-6">
            Dlaczego Goście wybierają właśnie nas?
          </h2>

          <ul className="space-y-4 text-gray-700 text-lg">
            <li>• Eleganckie i przestronne pokoje z widokiem na naturę</li>
            <li>• Restauracja serwująca autorską kuchnię premium</li>
            <li>• Nowoczesna strefa SPA & Wellness dla pełnego relaksu</li>
            <li>
              • Spersonalizowana obsługa — od momentu rezerwacji po wymeldowanie
            </li>
            <li>
              • Idealne miejsce na romantyczny weekend, rodzinny pobyt lub
              podróż biznesową
            </li>
          </ul>

          <p className="mt-8 text-gray-700 leading-relaxed">
            W Riverside Hotel wierzymy, że luksus tkwi w szczegółach. Dbamy o
            atmosferę, indywidualne podejście i najwyższą jakość usług, aby
            każdy Gość czuł się wyjątkowo.
          </p>
        </div>
      </div>
    </section>
  );
}
