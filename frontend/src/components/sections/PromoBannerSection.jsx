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
    <div className="flex gap-3">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="rounded-lg bg-white/20 px-3 py-2 backdrop-blur-sm">
            <span className="text-xl font-bold text-white">{pad(item.value)}</span>
          </div>
          <span className="mt-1 block text-xs text-white/80">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function PromoBannerSection() {
  return (
    <section className="bg-white">
      <div className=" px-4 py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-red-600 p-8 lg:p-12">
            <div className="relative z-10">
              <span className="text-sm font-semibold uppercase tracking-wider text-white/90">
                {promoData.flashSale.tag}
              </span>

              <h3 className="mt-3 text-3xl font-bold text-white lg:text-4xl">
                {promoData.flashSale.title}
              </h3>

              <div className="mt-6">
                <CountdownTimer />
              </div>

              <Link
                to={promoData.flashSale.ctaLink}
                className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
              >
                {promoData.flashSale.cta}
              </Link>
            </div>

            <div className="absolute -bottom-10 -right-10 z-0 hidden lg:block">
              <img
                src={promoData.flashSale.productImage}
                alt="Flash sale product"
                className="h-64 w-64 rotate-12 transform object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gray-900">
            <div className="absolute inset-0">
              <img
                src={promoData.collection.backgroundImage}
                alt="New collection"
                className="h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 p-8 lg:p-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                {promoData.collection.tag}
              </span>

              <h3 className="mt-3 text-3xl font-bold text-white lg:text-4xl">
                {promoData.collection.title}
              </h3>

              <p className="mt-3 text-gray-300">
                {promoData.collection.description}
              </p>

              <Link
                to={promoData.collection.ctaLink}
                className="mt-8 inline-block rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
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
