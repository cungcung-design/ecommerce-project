import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import ProductGridSection from "../components/sections/ProductGridSection";
import PromoBannerSection from "../components/sections/PromoBannerSection";
import demoProducts from "../data/demoProducts";

function Home() {
  const products = demoProducts;

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />

      <ProductGridSection
        title="New Arrivals"
        actionText="View All New Arrivals →"
        products={products}
        viewAllLink="/products"
      />

      <ProductGridSection
        title="Best Sellers"
        actionText="View All Best Sellers →"
        products={products.slice(0, 6)}
        viewAllLink="/products"
      />

      <PromoBannerSection />
    </div>
  );
}

export default Home;
