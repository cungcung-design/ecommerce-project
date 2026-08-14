import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import ProductGridSection from "../components/sections/ProductGridSection";
import PromoBannerSection from "../components/sections/PromoBannerSection";
import demoProducts from "../data/demoProducts";

function Home() {
  const products = demoProducts;
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#new-arrivals") {
      const el = document.getElementById("new-arrivals");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
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

      <ProductGridSection
        id="new-arrivals"
        title="New Arrivals"
        actionText="View All New Arrivals →"
        products={products}
        viewAllLink="/products?sort=newest"
      />

      <ProductGridSection
        title="Best Sellers"
        actionText="View All Best Sellers →"
        products={products.slice(0, 6)}
        viewAllLink="/products?sort=best-selling"
      />

      <PromoBannerSection />
    </div>
  );
}

export default Home;
