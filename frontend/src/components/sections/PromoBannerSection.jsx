import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import promoData from "../../data/promoData";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num) => String(num).padStart(2, "0");

  return (
    <div className="flex gap-2 sm:gap-3">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="rounded-lg bg-white/25 px-2 py-1.5 sm:px-3 sm:py-2 backdrop-blur-md border border-white/20 shadow-inner">
            <span className="text-base sm:text-xl font-bold text-white">{pad(item.value)}</span>
          </div>
          <span className="mt-0.5 sm:mt-1 block text-[10px] sm:text-xs font-medium text-white/90">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function PromoBannerSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-6 sm:p-8 lg:p-12 shadow-xl shadow-orange-500/10 group">
            {/* Subtle background glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/90">
                {promoData.flashSale.tag}
              </span>

              <h3 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-white lg:text-4xl">
                {promoData.flashSale.title}
              </h3>

              <div className="mt-4 sm:mt-6">
                <CountdownTimer />
              </div>

              <Link
                to={promoData.flashSale.ctaLink}
                className="mt-6 sm:mt-8 inline-block rounded-full bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
              >
                {promoData.flashSale.cta}
              </Link>
            </div>

            <div className="absolute -bottom-10 -right-10 z-0 hidden lg:block pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
              <img
                src={promoData.flashSale.productImage}
                alt="Flash sale product"
                className="h-64 w-64 rotate-12 transform object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-900 shadow-xl group">
            <div className="absolute inset-0">
              <img
                src={promoData.collection.backgroundImage}
                alt="New collection"
                className="h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-12">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400">
                {promoData.collection.tag}
              </span>

              <h3 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-white lg:text-4xl">
                {promoData.collection.title}
              </h3>

              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-300">
                {promoData.collection.description}
              </p>

              <Link
                to={promoData.collection.ctaLink}
                className="mt-6 sm:mt-8 inline-block rounded-full border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                {promoData.collection.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBannerSection;