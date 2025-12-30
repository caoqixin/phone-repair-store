import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Menu, X, Phone, Moon, MapPin, Megaphone } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import CookieBanner from "./CookieBanner";
import Instagram from "../assets/instagram.svg?react";
import Facebook from "../assets/facebook.svg?react";
import { BusinessHour, Holiday, Settings } from "../types";
import { API_BASE_URL } from "../constants/constants";

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === "zh";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [businessStatus, setBusinessStatus] = useState<{
    isOpen: boolean;
    message: string;
    type: "open" | "closed" | "holiday";
  }>({ isOpen: false, message: "", type: "closed" });

  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    loadSettings();
    // 每30秒更新一次设置和营业状态
    const interval = setInterval(() => {
      loadSettings();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (businessHours.length > 0) {
      calculateBusinessStatus();
      // 每分钟更新一次营业状态
      const statusInterval = setInterval(calculateBusinessStatus, 60000);
      return () => clearInterval(statusInterval);
    }
  }, [businessHours, holidays]);

  const loadSettings = async () => {
    try {
      const [settingsRes, businessHoursRes, holidaysRes] = await Promise.all([
        fetch(`${API_BASE_URL}/settings`),
        fetch(`${API_BASE_URL}/business-hours`),
        fetch(`${API_BASE_URL}/holidays`),
      ]);

      const settingsData = await settingsRes.json();
      const businessHoursData = await businessHoursRes.json();
      const holidaysData = await holidaysRes.json();

      if (settingsData.success) setSettings(settingsData.data);
      if (businessHoursData.success) setBusinessHours(businessHoursData.data);
      if (holidaysData.success) setHolidays(holidaysData.data);
    } catch (error) {
      console.error("Load settings error:", error);
    }
  };

  const calculateBusinessStatus = () => {
    const now = new Date();
    const today = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const todayStr = now.toISOString().split("T")[0];

    // 检查是否在节假日
    const isHoliday = holidays.some((h) => {
      return h.is_active && todayStr >= h.start_date && todayStr <= h.end_date;
    });

    if (isHoliday) {
      const holiday = holidays.find(
        (h) => h.is_active && todayStr >= h.start_date && todayStr <= h.end_date
      );
      setBusinessStatus({
        isOpen: false,
        message: isZh
          ? `放假中 - ${holiday?.name}`
          : `Chiuso per festività - ${holiday?.name}`,
        type: "holiday",
      });
      return;
    }

    // 检查今天营业时间
    const todayHours = businessHours.find((h) => h.day_of_week === today);

    if (!todayHours || !todayHours.is_open) {
      setBusinessStatus({
        isOpen: false,
        message: isZh ? "今日休息" : "Chiuso oggi",
        type: "closed",
      });
      return;
    }

    // 检查当前时间是否在营业时间内
    let isCurrentlyOpen = false;

    if (todayHours.morning_open && todayHours.morning_close) {
      if (
        currentTime >= todayHours.morning_open &&
        currentTime <= todayHours.morning_close
      ) {
        isCurrentlyOpen = true;
      }
    }

    if (todayHours.afternoon_open && todayHours.afternoon_close) {
      if (
        currentTime >= todayHours.afternoon_open &&
        currentTime <= todayHours.afternoon_close
      ) {
        isCurrentlyOpen = true;
      }
    }

    if (isCurrentlyOpen) {
      setBusinessStatus({
        isOpen: true,
        message: isZh ? "营业中" : "Aperto",
        type: "open",
      });
    } else {
      // 检查是否是午休时间
      if (
        todayHours.morning_close &&
        todayHours.afternoon_open &&
        currentTime > todayHours.morning_close &&
        currentTime < todayHours.afternoon_open
      ) {
        setBusinessStatus({
          isOpen: false,
          message: isZh
            ? `午休中 (${todayHours.afternoon_open} 开门)`
            : `Pausa pranzo (Riapre ${todayHours.afternoon_open})`,
          type: "closed",
        });
      } else {
        setBusinessStatus({
          isOpen: false,
          message: isZh ? "今日已关门" : "Chiuso",
          type: "closed",
        });
      }
    }
  };

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/services", label: t("nav.services") },
    { path: "/booking", label: t("nav.booking") },
    { path: "/contact", label: t("nav.contact") },
    { path: "/about", label: t("nav.about") },
  ];

  if (isAdmin) return <Outlet />;

  const announcement = isZh
    ? settings.announcement_cn
    : settings.announcement_it;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Top Banner - Announcement */}
      {announcement && (
        <div className="bg-amber-500 text-white text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2 animate-fade-in">
          <Megaphone className="size-4" />
          <span>{announcement}</span>
        </div>
      )}

      {/* Info Bar with Business Status */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" /> {settings.address}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="size-3" /> {settings.phone}
            </span>
            {/* Business Status Badge */}
            <span
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full font-bold ${
                businessStatus.type === "open"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : businessStatus.type === "holiday"
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  businessStatus.type === "open"
                    ? "bg-emerald-400 animate-pulse"
                    : businessStatus.type === "holiday"
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
              />
              {businessStatus.message}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
            )}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.shop_name}
                  className="h-8 w-auto rounded"
                />
              ) : (
                <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors shadow-sm">
                  <Moon className="size-6" fill="currentColor" />
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {settings.shop_name}
              </span>
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary-600"
                        : "text-slate-600 hover:text-primary-600"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              <a
                href={`tel:${settings.phone?.replace(/ /g, "") || ""}`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg flex items-center gap-2"
              >
                <Phone className="size-4" />
                {t("nav.call_now")}
              </a>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-primary-600 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 animate-slide-in">
            <div className="px-4 pt-2 pb-4 space-y-1 shadow-xl">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 rounded-lg text-base font-medium ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4">
                <a
                  href={`tel:${settings.phone?.replace(/ /g, "") || ""}`}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-center font-bold shadow-md block"
                >
                  {t("nav.call_now")}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Moon className="size-5 text-primary-500" fill="currentColor" />
              <span className="font-bold text-lg">{settings.shop_name}</span>
            </div>
            <p className="mb-4 max-w-xs leading-relaxed opacity-80">
              {isZh
                ? settings.website_description_cn
                : settings.website_description_it}
            </p>
            {settings.p_iva && (
              <p className="text-xs text-slate-500 mt-4">
                P.IVA:{" "}
                <span className="font-mono text-slate-400">
                  {settings.p_iva}
                </span>
              </p>
            )}
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              {t("nav.contact")}
            </h4>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 text-primary-500" />
                {settings.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-primary-500" />
                {settings.phone}
              </p>
              {settings.email && (
                <p className="flex items-center gap-2">
                  <span className="text-primary-500">✉</span>
                  {settings.email}
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t("footer.privacy_link")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t("footer.terms_link")}
                </NavLink>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="size-5" />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="size-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {settings.shop_name}. All rights
          reserved.
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
};

export default Layout;
