import Navbar from "../../components/common/Nav";
import HeroSection from "../../components/common/HeroSection";
import AboutSection from "../../components/common/AboutSection";
import Footer from "../../components/common/Footer";

// Home page (landing page)
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Footer />
    </>
  );
}
