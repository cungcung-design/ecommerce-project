import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-200",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% secure checkout",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-200",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-200",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600",
    borderColor: "hover:border-orange-200",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50/50 to-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden flex items-start gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 ${feature.borderColor}`}
              >
                {/* Subtle background glow on hover */}
                <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />

                <div className="relative flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-50 text-orange-600 ring-3 ring-orange-50/50 transition-transform duration-300 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white shadow-sm sm:h-12 sm:w-12">
                    <IconComponent className="h-5 w-5 transition-colors duration-300 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-sm sm:text-base font-medium text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-orange-600">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;