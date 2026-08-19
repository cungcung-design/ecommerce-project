import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import NewArrivalsSection from "../components/sections/NewArrivalsSection";
import BestSellersSection from "../components/sections/BestSellersSection";
import PromoBannerSection from "../components/sections/PromoBannerSection";

function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#categories") {
      const el = document.getElementById("categories");
      if (el) {
        setTimeout(() => {
          const navHeight = 80;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: "smooth",
          });
        }, 0);
      }
    } else if (hash === "#new-arrivals") {
      const el = document.getElementById("new-arrivals");
      if (el) {
        setTimeout(() => {
          const navHeight = 80;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: "smooth",
          });
        }, 0);
      }
    } else if (hash === "#best-sellers") {
      const el = document.getElementById("best-sellers");
      if (el) {
        setTimeout(() => {
          const navHeight = 80;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: "smooth",
          });
        }, 0);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />

      <NewArrivalsSection
        id="new-arrivals"
        viewAllLink="/products?sort=newest"
      />

      <BestSellersSection id="best-sellers" />

      <PromoBannerSection />
    </div>
  );
}

export default Home;
