import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from '../components/ErrorMessage';

export default function Hero() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (location.state?.reservationSuccess) {
      setShowMessage(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <header className="relative h-screen bg-[url('../hotel-pic-1.jpg')] bg-cover bg-center">
      {showMessage && (
        <ErrorMessage
          header="Rezerwacja Zakończona"
          message="Twoja rezerwacja została zapisana"
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        <h1 className="font-display text-9xl">Witamy w Riverside</h1>
        <p className="text-xl mb-8">Luksusowy wypoczynek w sercu natury</p>

      </div>
    </header>
  );
}
