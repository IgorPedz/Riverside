import Hero from "../components/Hero";
import Rooms from "../components/Rooms";
import Amenities from "../components/Amenities";
import About from "../components/About";
import Spa from "../components/Spa";
import Restaurant from "../components/Restaurant";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";

export default function App() {
  return (
    <div className="font-sans text-gray-800">
      <NavBar />
      <Hero />
      <Rooms />
      <Amenities />
      <About />
      <Spa />
      <Restaurant />
      <Gallery />
      <Footer />
    </div>
  );
}
