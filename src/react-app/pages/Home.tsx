import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Zap, ShieldCheck, Star } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import ParcelTracker from "../components/ParcelTracker";
import ServiceCard from "../components/ServiceCard";
import { HomeData } from "../loader/home";
import { useBusinessStatus } from "../hooks/use-business-status";

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  const { settings, services, businessHours, holidays, carriers } =
    useLoaderData() as HomeData;

  const businessStatus = useBusinessStatus(businessHours, holidays);

  const features = [
    {
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      titleKey: "features.fast.title",
      descKey: "features.fast.desc",
    },
    {
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50",
      titleKey: "features.warranty.title",
      descKey: "features.warranty.desc",
    },
    {
      icon: Star,
      color: "text-purple-500",
      bg: "bg-purple-50",
      titleKey: "features.expert.title",
      descKey: "features.expert.desc",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/95 to-slate-900/50 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1920&q=80"
            alt="Repair Shop"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Business Status Badge */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  businessStatus.type === "open"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : businessStatus.type === "holiday"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                <span
                  className={`size-2 rounded-full animate-pulse ${
                    businessStatus.type === "open"
                      ? "bg-emerald-400"
                      : businessStatus.type === "holiday"
                        ? "bg-amber-400"
                        : "bg-red-400"
                  }`}
                />
                {businessStatus.message}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-[1.1]">
              {settings.shop_name || "Phone Repair Shop"}
            </h1>

            {/* Website Description */}
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {isZh
                ? settings.website_description_cn
                : settings.website_description_it}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/booking"
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Clock className="size-5" /> {t("nav.booking")}
              </Link>
              <Link
                to="/contact"
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="size-5" /> {t("nav.contact")}
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto lg:max-w-none lg:translate-x-8">
            <ParcelTracker carriers={carriers} />
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div
                className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110`}
              >
                <f.icon className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t(f.titleKey)}
              </h3>
              <p className="text-slate-600 leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Services Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t("services.title")}
            </h2>
            <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              {t("services.subtitle") || "专业的维修服务,值得信赖"}
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center text-slate-500 py-12">暂无服务项目</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 8).map((s) => (
                <ServiceCard
                  key={s.id}
                  title={isZh ? s.title_cn : s.title_it}
                  description={isZh ? s.description_cn : s.description_it}
                  iconName={s.icon_name}
                  price={s.price_display}
                  category={s.category}
                />
              ))}
            </div>
          )}

          {services.length > 8 && (
            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:-translate-y-1"
              >
                {t("services.view_all") || "查看所有服务"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Map Embed */}
      {settings.map_embed_url && (
        <section className="h-96 w-full bg-slate-200">
          <iframe
            src={settings.map_embed_url}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="grayscale hover:grayscale-0 transition-all duration-700 contrast-125 opacity-90 hover:opacity-100"
            title="Map"
          />
        </section>
      )}
    </div>
  );
};

export default Home;
