const floatingProducts = [
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
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-12 lg:pt-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Left Column: Text & CTAs */}
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600">
              Trending Now
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
              Discover Products <br /> You&apos;ll Love
            </h1>

            <p className="mt-4 text-base text-gray-600 lg:text-lg">
              Shop the latest trending products curated for modern lifestyles.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors">
                Shop Now →
              </button>

              <button className="rounded-full border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-800 hover:border-gray-900 transition-colors">
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
          <div className="relative flex justify-center items-center py-6">
            {/* Red Organic Background Blob Shape */}
            <div className="absolute h-[420px] w-[90%] max-w-lg rounded-[3rem] bg-gradient-to-tr from-red-500 to-orange-500 shadow-2xl rotate-3" />

            {/* Main Model Image */}
<img
  src="https://i.pinimg.com/736x/89/ac/78/89ac7841d71b268c291db5110f1075a7.jpg"
  alt="Female fashion model"
  className="relative z-10 h-[480px] w-full max-w-md rounded-[2.5rem] object-cover object-top shadow-lg"
/>
            {/* Floating Product Cards mapped from array */}
            {floatingProducts.map((product, index) => (
              <div
                key={index}
                className={`absolute z-20 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl backdrop-blur-md bg-opacity-95 border border-gray-100 ${product.position}`}
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
          <button className="h-2 w-6 rounded-full bg-orange-600 transition-all" aria-label="Slide 1" />
          <button className="h-2 w-2 rounded-full bg-gray-300 transition-all" aria-label="Slide 2" />
          <button className="h-2 w-2 rounded-full bg-gray-300 transition-all" aria-label="Slide 3" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;