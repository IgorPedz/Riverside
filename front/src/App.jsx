import { Routes, Route, useLocation } from "react-router-dom";

// Komponenty
import Hero from "./components/Hero";
import Rooms from "./components/Rooms";
import Amenities from "./components/Amenities";
import AboutSection from "./components/About";
import SpaSection from "./components/Spa";
import RestaurantSection from "./components/Restaurant";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import NavBar from "./components/Navbar";

// Strony
import RestaurantPage from "./pages/Restaurant-page";
import SpaPage from "./pages/SPA-page";
import AboutPage from "./pages/About-page";
import LoginPage from "./pages/Login-page";
import RegisterPage from "./pages/Register-page";
import OffersPage from "./pages/Offer-page";
import OffersPageRooms from "./pages/offer-rooms-page";
import OffersPageSPA from "./pages/SPA-offer-page"
import ReservationPage from "./pages/Reservation-page";
import ProfilPage from "./pages//Profile-page"
import ReservationSPAPage from "./pages/Reservations-SPA-page";
export default function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/rejestracja", "/rezerwacja","/rezerwacja/spa"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="font-sans text-gray-800">
      {!hideNavbar && <NavBar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Rooms />
              <Amenities />
              <AboutSection />
              <SpaSection />
              <RestaurantSection />
              <Gallery />
            </>
          }
        />

        <Route path="/restauracja" element={<RestaurantPage />} />
        <Route path="/spa" element={<SpaPage />} />
        <Route path="/o-nas" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rejestracja" element={<RegisterPage />} />
        <Route path="/oferty" element={<OffersPage />} />
        <Route path="/oferty/noclegi" element={<OffersPageRooms />} />
        <Route path="/oferty/spa" element={<OffersPageSPA />} />
        <Route path="/rezerwacja" element={<ReservationPage />} />
        <Route path="/rezerwacja/spa" element={<ReservationSPAPage />} />
        <Route path="/profil" element={<ProfilPage />} />
      </Routes>

      <Footer />
    </div>
  );
}
