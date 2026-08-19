import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slidesData = [
  {
    category: "Trending Now",
    title: "Discover Products\nYou'll Love",
    description: "Shop the latest trending products curated for modern lifestyles.",
    image: "https://i.pinimg.com/736x/89/ac/78/89ac7841d71b268c291db5110f1075a7.jpg",
    shopNowLink: "/products",
    floatingProducts: [
      {
        name: "Air Max 270",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
      },
      {
        name: "Smart Watch",
        price: "$199.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
      },
      {
        name: "Wireless Headphones",
        price: "$99.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      },
      {
        name: "Water Bottle",
        price: "$24.99",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    category: "New Arrivals",
    title: "Step Up Your\nStyle Game",
    description: "Explore fresh drops and exclusive styles designed to turn heads.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    shopNowLink: "/products",
    floatingProducts: [
      {
        name: "Denim Jacket",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop",
      },
      {
        name: "Leather Tote",
        price: "$149.99",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    category: "Summer Collection",
    title: "Ready For\nThe Sunshine",
    description: "Get vacation-ready with lightweight fabrics and vibrant accessories.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    shopNowLink: "/products",
    floatingProducts: [
      {
        name: "Sunglasses",
        price: "$49.99",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&h=100&fit=crop",
      },
      {
        name: "Sun Hat",
        price: "$34.99",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=100&h=100&fit=crop",
      },
    ],
  },
];

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const current = slidesData[activeSlide];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slidesData.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getFloatingPosition = (slideIndex, productIndex) => {
    // Trending Now: Air Max, Smart Watch, Wireless Headphones (moved a bit further down), Water Bottle
    if (slideIndex === 0) {
      const trendingPositions = [
        "top-2 left-2 sm:top-3 sm:left-3 lg:-top-4 lg:-left-6",     // Air Max 270
        "top-16 right-2 sm:top-20 sm:right-3 lg:top-8 lg:-right-6",  // Smart Watch
        "top-[62%] left-2 sm:left-3 lg:left-2 lg:top-[62%]",       // Wireless Headphones (nudged down more)
        "bottom-4 right-2 sm:bottom-6 sm:right-3 lg:-right-6 lg:bottom-10", // Water Bottle
      ];
      return trendingPositions[productIndex] || "";
    }

    // New Arrivals: Denim Jacket (Up), Leather Tote (Down)
    if (slideIndex === 1) {
      const newArrivalsPositions = [
        "top-4 right-3 sm:top-6 sm:right-6 lg:top-8 lg:-right-6",     
        "bottom-12 left-3 sm:bottom-16 sm:left-6 lg:bottom-12 lg:-left-6" 
      ];
      return newArrivalsPositions[productIndex] || "";
    }

    // Summer Collection: Sunglasses (Up), Sun Hat (Down)
    if (slideIndex === 2) {
      const summerPositions = [
        "top-4 right-3 sm:top-6 sm:right-6 lg:top-8 lg:-right-6",     
        "bottom-12 left-3 sm:bottom-16 sm:left-6 lg:bottom-12 lg:-left-6" 
      ];
      return summerPositions[productIndex] || "";
    }

    return "";
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-12 lg:pt-8 lg:py-20">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-12">
          
          <div className="relative z-10 transition-all duration-300 lg:col-span-5 lg:col-start-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600">
              {current.category}
            </span>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 lg:text-6xl whitespace-pre-line">
              {current.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-gray-600 lg:text-lg">
              {current.description}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to={current.shopNowLink}
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-orange-600 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors text-center no-underline"
              >
                Shop Now →
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="Customer" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" alt="Customer" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop" alt="Customer" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop" alt="Customer" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-white object-cover" />
              </div>

              <div className="text-xs sm:text-sm">
                <p className="font-bold text-gray-900">Loved by 50,000+ customers worldwide</p>
              </div>
            </div>
          </div>

          <div 
            onClick={handleNextSlide}
            className="relative flex justify-center items-center py-6 sm:py-8 cursor-pointer group select-none lg:col-span-5 lg:col-start-7"
            title="Click to view next slide"
          >
            <div className="relative w-full max-w-sm sm:max-w-md flex justify-center">
              <div className="relative overflow-visible w-full flex justify-center">
                <div className="absolute h-[320px] sm:h-[380px] lg:h-[420px] w-[85%] max-w-xs sm:max-w-sm rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-tr from-red-500 to-orange-500 shadow-2xl rotate-3 transition-transform duration-500 group-hover:scale-105" />

                <img
                  src={current.image}
                  alt="Fashion model"
                  className="relative z-10 h-[360px] sm:h-[420px] lg:h-[480px] w-[85%] sm:w-full max-w-xs sm:max-w-md rounded-[2rem] sm:rounded-[2.5rem] object-cover object-top shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {current.floatingProducts.map((product, index) => (
                <div
                  key={index}
                  className={`absolute z-20 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-3 shadow-lg sm:shadow-xl backdrop-blur-md bg-opacity-95 border border-gray-100 transition-all duration-300 scale-90 sm:scale-100 ${getFloatingPosition(activeSlide, index)}`}
                >
                  <img src={product.image} alt={product.name} className="h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl object-cover bg-gray-50" />
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-900">{product.name}</p>
                    <p className="text-[9px] sm:text-xs font-medium text-gray-500">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6 sm:mt-8 flex justify-center gap-2">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === index ? "w-6 bg-orange-600" : "w-2 bg-gray-300"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;