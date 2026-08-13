import { useState, useEffect } from "react";

const slidesData = [
  {
    category: "Trending Now",
    title: "Discover Products\nYou'll Love",
    description: "Shop the latest trending products curated for modern lifestyles.",
    image: "https://i.pinimg.com/736x/89/ac/78/89ac7841d71b268c291db5110f1075a7.jpg",
    floatingProducts: [
      {
        name: "Air Max 270",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
        position: "top-4 left-10 lg:-top-6 lg:left-20",
      },
      {
        name: "Smart Watch",
        price: "$199.99",
        image: "https://i.pinimg.com/736x/e8/9f/d4/e89fd4a025aea0ffcce91d0c71bf2dbc.jpg",
        position: "top-10 right-4 lg:top-8 lg:right-16",
      },
      {
        name: "Wireless Headphones",
        price: "$99.99",
        image: "https://i.pinimg.com/736x/ce/43/99/ce4399b687015e608178b2d7f03da0ac.jpg",
        position: "top-1/2 -left-6 lg:left-4 -translate-y-1/2",
      },
      {
        name: "Water Bottle",
        price: "$24.99",
        image: "https://i.pinimg.com/1200x/36/f7/2d/36f72df19cd9b9561cebb75991e62221.jpg",
        position: "bottom-12 right-4 lg:bottom-16 lg:right-12",
      },
    ],
  },
  {
    category: "New Arrivals",
    title: "Step Up Your\nStyle Game",
    description: "Explore fresh drops and exclusive styles designed to turn heads.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    floatingProducts: [
      {
        name: "Denim Jacket",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop",
        position: "top-6 left-6 lg:top-4 lg:left-12",
      },
      {
        name: "Leather Tote",
        price: "$149.99",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop",
        position: "bottom-10 right-6 lg:bottom-12 lg:right-10",
      },
    ],
  },
  {
    category: "Summer Collection",
    title: "Ready For\nThe Sunshine",
    description: "Get vacation-ready with lightweight fabrics and vibrant accessories.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    floatingProducts: [
      {
        name: "Sunglasses",
        price: "$49.99",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&h=100&fit=crop",
        position: "top-8 right-6 lg:top-10 lg:right-16",
      },
      {
        name: "Sun Hat",
        price: "$34.99",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=100&h=100&fit=crop",
        position: "bottom-16 left-6 lg:bottom-20 lg:left-12",
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

  // Auto-play time interval (changes slide every 5000ms / 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 7000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaX > 20 || e.deltaY > 20) {
      handleNextSlide();
    } else if (e.deltaX < -20 || e.deltaY < -20) {
      handlePrevSlide();
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="px-4 pt-4 pb-12 lg:pt-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column: Text & CTAs */}
          <div className="relative z-10 transition-all duration-300 lg:col-span-5 lg:col-start-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600">
              {current.category}
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 lg:text-6xl whitespace-pre-line">
              {current.title}
            </h1>

            <p className="mt-4 text-base text-gray-600 lg:text-lg">
              {current.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors cursor-pointer">
                Shop Now →
              </button>

              <button className="rounded-full border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-800 hover:border-gray-900 transition-colors cursor-pointer">
                Explore Collection
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="Customer" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" alt="Customer" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop" alt="Customer" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop" alt="Customer" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
              </div>

              <div className="text-sm">
                <p className="font-bold text-gray-900">Loved by 50,000+ customers worldwide</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Graphic & Floating Cards */}
          <div 
            onClick={handleNextSlide}
            onWheel={handleWheel}
            className="relative flex justify-center items-center py-6 cursor-pointer group select-none lg:col-span-5 lg:col-start-7"
            title="Click to view next slide, or scroll left/right"
          >
            {/* Red Organic Background Blob Shape */}
            <div className="absolute h-[420px] w-[90%] max-w-lg rounded-[3rem] bg-gradient-to-tr from-red-500 to-orange-500 shadow-2xl rotate-3 transition-transform duration-500 group-hover:scale-105" />

            {/* Main Model Image */}
            <img
              src={current.image}
              alt="Fashion model"
              className="relative z-10 h-[480px] w-full max-w-md rounded-[2.5rem] object-cover object-top shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Floating Product Cards mapped from active slide */}
            {current.floatingProducts.map((product, index) => (
              <div
                key={index}
                className={`absolute z-20 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl backdrop-blur-md bg-opacity-95 border border-gray-100 transition-all duration-300 ${product.position}`}
              >
                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover bg-gray-50" />
                <div>
                  <p className="text-xs font-bold text-gray-900">{product.name}</p>
                  <p className="text-xs font-medium text-gray-500">{product.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Carousel Indicators */}
        <div className="mt-8 flex justify-center gap-2">
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