import React from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { BusinessHour } from "../types";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { ContactData } from "../loader/contact";

const HoursRow = ({
  label,
  hours,
  isClosed,
  isToday,
}: {
  label: string;
  hours: string;
  isClosed: boolean;
  isToday: boolean;
}) => (
  <div
    className={`flex justify-between items-start py-2 border-b border-slate-800 last:border-0 ${
      isToday ? "bg-white/10 -mx-4 px-4 rounded-lg" : ""
    }`}
  >
    <span
      className={`${
        isToday ? "text-primary-400 font-bold" : "text-slate-400"
      } w-24 shrink-0`}
    >
      {label} {isToday && "•"}
    </span>
    <span
      className={`text-right font-medium ${
        isClosed ? "text-red-400" : "text-white"
      }`}
    >
      {isClosed ? "Chiuso" : hours}
    </span>
  </div>
);

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, businessHours, holidays } = useLoaderData() as ContactData;
  const actionData = useActionData() as
    | { success?: boolean; error?: string }
    | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // 1. 将 API 的 0-6 (周日开始) 映射为符合意大利习惯的排序 (周一到周日: 1,2,3,4,5,6,0)
  const sortedHours = [...businessHours].sort((a, b) => {
    const mapDay = (d: number) => (d === 0 ? 7 : d);
    return mapDay(a.day_of_week) - mapDay(b.day_of_week);
  });

  // 2. 获取当前是周几 (用于高亮)
  const todayIndex = new Date().getDay();

  // 3. 格式化显示的函数
  const formatTime = (h: BusinessHour) => {
    if (!h.is_open) return null;
    // 如果有午休分段
    if (
      h.morning_open &&
      h.morning_close &&
      h.afternoon_open &&
      h.afternoon_close
    ) {
      return `${h.morning_open.slice(0, 5)}-${h.morning_close.slice(
        0,
        5
      )} / ${h.afternoon_open.slice(0, 5)}-${h.afternoon_close.slice(0, 5)}`;
    }
    // 如果是全天
    if (h.morning_open && h.morning_close) {
      return `${h.morning_open.slice(0, 5)} - ${h.morning_close.slice(0, 5)}`;
    }
    return "Open";
  };

  const upcomingHolidays = holidays
    .filter((h) => h.is_active && new Date(h.end_date) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .slice(0, 2); // 只显示最近2个

  // 5. 星期几的多语言映射
  const dayNames: Record<number, string> = {
    1: t("days.mon", "Mon"),
    2: t("days.tue", "Tue"),
    3: t("days.wed", "Wed"),
    4: t("days.thu", "Thu"),
    5: t("days.fri", "Fri"),
    6: t("days.sat", "Sat"),
    0: t("days.sun", "Sun"),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            {t("contact.title", "Get in Touch")}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {t("contact.subtitle", "Have a question? We are here to help.")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column: Info & Hours */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
              <div className="space-y-6 relative z-10">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 shrink-0">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      {t("contact.location", "Address")}
                    </h4>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        settings.address!
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-primary-600 transition-colors"
                    >
                      {settings.address}
                    </a>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                    <Phone className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      {t("contact.phone", "Phone")}
                    </h4>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      {t("contact.email", "Email")}
                    </h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Dynamic Opening Hours Card --- */}
            <div className="bg-slate-900 text-slate-300 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Clock className="size-6 text-primary-400" />
                <h3 className="text-xl font-bold text-white">
                  {t("contact.hours_title", "Opening Hours")}
                </h3>
              </div>

              <div className="space-y-1 relative z-10 text-sm">
                {sortedHours.length > 0 ? (
                  sortedHours.map((h) => (
                    <HoursRow
                      key={h.day_of_week}
                      label={dayNames[h.day_of_week]}
                      hours={formatTime(h) || ""}
                      isClosed={!h.is_open}
                      isToday={h.day_of_week === todayIndex}
                    />
                  ))
                ) : (
                  <p className="text-slate-500 italic">Loading hours...</p>
                )}
              </div>

              {/* Holidays Section */}
              {upcomingHolidays.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700 relative z-10 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <CalendarDays className="size-4" />
                    <span>Upcoming Holidays</span>
                  </div>
                  <div className="space-y-3">
                    {upcomingHolidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center text-xs"
                      >
                        <span className="text-slate-200 font-medium">
                          {holiday.name}
                        </span>
                        <span className="text-slate-400">
                          {new Date(holiday.start_date).toLocaleDateString(
                            i18n.language,
                            { month: "short", day: "numeric" }
                          )}
                          {holiday.start_date !== holiday.end_date &&
                            ` - ${new Date(holiday.end_date).toLocaleDateString(
                              i18n.language,
                              { month: "short", day: "numeric" }
                            )}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form (保持不变) */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/60 border border-slate-100 h-fit">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {t("contact.form_title", "Send us a message")}
            </h3>
            {actionData?.success ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="size-8" />
                </div>
                <h4 className="text-xl font-bold text-emerald-800 mb-2">
                  {t("contact.message_sent", "Message Sent!")}
                </h4>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 text-sm font-bold text-emerald-600 hover:text-emerald-800 underline"
                >
                  {t("contact.send_another", "Send another message")}
                </button>
              </div>
            ) : (
              <Form method="post" className="space-y-6">
                {/* ... Inputs ... */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t("contact.form.name", "Name")}
                  </label>
                  <input
                    name="name"
                    placeholder={t("contact.form.placeholder.name")}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t("contact.form.email", "Email")}
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder={t("contact.form.placeholder.email")}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t("contact.form.message", "Message")}
                  </label>
                  <textarea
                    name="message"
                    placeholder={t("contact.form.placeholder.message")}
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span className="mr-2">
                        {t("contact.form.send", "Send")}
                      </span>
                      <Send className="size-4" />
                    </>
                  )}
                </button>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
