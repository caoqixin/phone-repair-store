import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { BusinessHour, Holiday, Settings } from "../types";
import { API_BASE_URL } from "../constants/constants";

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === "zh";
  const [settings, setSettings] = useState<Settings>({});
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dayNames = isZh
    ? ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    : [
        "Domenica",
        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
      ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(
          data.error || (isZh ? "发送失败,请重试" : "Invio fallito, riprova")
        );
      }
    } catch (error) {
      console.error("Submit contact error:", error);
      setError(
        isZh ? "网络错误,请稍后重试" : "Errore di rete, riprova più tardi"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBusinessHours = (hour: BusinessHour) => {
    if (!hour.is_open) {
      return isZh ? "休息" : "Chiuso";
    }

    const parts = [];
    if (hour.morning_open && hour.morning_close) {
      parts.push(`${hour.morning_open}-${hour.morning_close}`);
    }
    if (hour.afternoon_open && hour.afternoon_close) {
      parts.push(`${hour.afternoon_open}-${hour.afternoon_close}`);
    }

    return parts.join(" | ") || (isZh ? "休息" : "Chiuso");
  };

  const isCurrentDay = (dayOfWeek: number) => {
    return new Date().getDay() === dayOfWeek;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("contact.title")}</h1>
        <p className="text-slate-300 text-lg">{t("contact.subtitle")}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-primary-600 size-5" />
                {t("contact.location")}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {settings.address || "Via Example 123, Milano"}
              </p>
              {settings.p_iva && (
                <p className="text-xs text-slate-500 pt-4 border-t border-slate-100">
                  P.IVA:{" "}
                  <span className="font-mono text-slate-600">
                    {settings.p_iva}
                  </span>
                </p>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="text-primary-600 size-5" />
                {t("contact.hours_title")}
              </h3>
              <div className="space-y-2 text-sm">
                {businessHours
                  .sort((a, b) => {
                    // Sort: Monday(1) to Sunday(0)
                    const orderA = a.day_of_week === 0 ? 7 : a.day_of_week;
                    const orderB = b.day_of_week === 0 ? 7 : b.day_of_week;
                    return orderA - orderB;
                  })
                  .map((hour) => (
                    <div
                      key={hour.day_of_week}
                      className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                        isCurrentDay(hour.day_of_week)
                          ? "bg-primary-50 border border-primary-200"
                          : "border border-transparent"
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          isCurrentDay(hour.day_of_week)
                            ? "text-primary-700"
                            : "text-slate-700"
                        }`}
                      >
                        {dayNames[hour.day_of_week]}
                      </span>
                      <span
                        className={`text-xs font-mono ${
                          hour.is_open
                            ? isCurrentDay(hour.day_of_week)
                              ? "text-primary-600"
                              : "text-slate-600"
                            : "text-slate-400"
                        }`}
                      >
                        {formatBusinessHours(hour)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Display active holidays */}
              {holidays.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-amber-600">
                    <AlertCircle className="size-4" />
                    <span className="text-sm font-bold">
                      {isZh ? "节假日" : "Festività"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {holidays.map((holiday, index) => (
                      <div
                        key={index}
                        className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-2"
                      >
                        <div className="font-semibold text-amber-900">
                          {holiday.name}
                        </div>
                        <div className="text-amber-700 font-mono">
                          {holiday.start_date} - {holiday.end_date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Phone className="text-primary-600 size-5" /> Contact
              </h3>
              <div className="space-y-4">
                <a
                  href={`tel:${(settings.phone || "").replace(/ /g, "")}`}
                  className="flex items-center gap-4 text-slate-700 hover:text-primary-600 transition-colors group"
                >
                  <div className="bg-slate-100 group-hover:bg-primary-50 p-3 rounded-full transition-colors">
                    <Phone className="size-5" />
                  </div>
                  <span className="font-medium text-lg">
                    {settings.phone || "+39 123 456 7890"}
                  </span>
                </a>
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 text-slate-700 hover:text-primary-600 transition-colors group"
                  >
                    <div className="bg-slate-100 group-hover:bg-primary-50 p-3 rounded-full transition-colors">
                      <Mail className="size-5" />
                    </div>
                    <span className="font-medium text-sm break-all">
                      {settings.email}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2 space-y-8">
            {settings.map_embed_url && (
              <div className="h-64 sm:h-80 bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <iframe
                  src={settings.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Map Location"
                />
              </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-primary-500">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                {t("contact.send_message")}
              </h3>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-slide-in flex items-center gap-2">
                  <AlertCircle className="size-5 shrink-0" />
                  {error}
                </div>
              )}

              {submitted ? (
                <div className="bg-emerald-50 text-emerald-800 p-8 rounded-xl flex items-start gap-4 animate-fade-in">
                  <MessageSquare className="size-8 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {t("contact.message_sent")}
                    </h4>
                    <p className="text-emerald-700 mb-4">
                      {t("contact.confirmation_sent")}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-emerald-800 font-semibold underline hover:text-emerald-950"
                    >
                      {t("contact.send_another")}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        {t("contact.form.name")}
                      </label>
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        {t("contact.form.email")}
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white px-8 py-3.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin size-4" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    {t(
                      isSubmitting
                        ? "contact.form.sending"
                        : "contact.form.send"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
