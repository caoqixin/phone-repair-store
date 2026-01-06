import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
} from "lucide-react";
import { Form, useActionData, useNavigation } from "react-router";

// 生成未来 14 天的日期数组，自动适配当前语言
const generateDates = (lang: string) => {
  const dates = [];
  const now = new Date();
  const timeZone = "Europe/Rome";
  const locale = lang === "zh" ? "zh-CN" : "it-IT";

  // A. 获取博洛尼亚当前的“年月日”
  // 使用 Intl.DateTimeFormat 获取基于罗马时区的各个部分，
  // 从而忽略用户浏览器本地时区（比如中国/美国）的干扰。
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric", // 1-12
    day: "numeric",
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || "0");

  const year = getPart("year");
  const month = getPart("month") - 1; // JS Date 月份从 0 开始
  const day = getPart("day");

  // B. 循环生成未来 7 天
  for (let i = 0; i < 7; i++) {
    // 构造一个“假装在本地”但实际上数值对应博洛尼亚日期的 Date 对象
    // 设置为中午 12:00 防止因 DST (夏令时) 切换导致日期跳变
    const d = new Date(year, month, day + i + 1, 12, 0, 0);

    // 跳过周日 (假设周日不营业)
    if (d.getDay() === 0) continue;

    // C. 格式化输出
    // 这里的 fullDate 是 ISO 格式 (YYYY-MM-DD)，发给后端
    // 后端收到 "2026-01-05" 就知道这是博洛尼亚的 1月5日
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const fullDate = `${yyyy}-${mm}-${dd}`;

    dates.push({
      fullDate: fullDate,
      dayName: d.toLocaleDateString(locale, { weekday: "short" }), // 周一 / Lun
      dayNum: d.toLocaleDateString(locale, { day: "2-digit" }), // 05
      monthName: d.toLocaleDateString(locale, { month: "short" }), // 1月 / Gen
    });
  }
  return dates;
};

const Booking: React.FC = () => {
  const { t, i18n } = useTranslation();
  const actionData = useActionData() as
    | { success?: boolean; error?: string }
    | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // State for UI selection (不直接提交，而是存入 hidden input)
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // 生成日期列表 (监听语言变化)
  const [dateList, setDateList] = useState(generateDates(i18n.language));

  useEffect(() => {
    setDateList(generateDates(i18n.language));
  }, [i18n.language]);

  // 固定时间槽 (后期可改为从 API 获取剩余空位)
  const timeSlots = [
    "09:30",
    "10:30",
    "11:30",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // --- Success View ---
  if (actionData?.success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="size-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t("booking.success.title", "Prenotazione Confermata!")}
        </h2>
        <p className="text-slate-500 max-w-md mb-8">
          {t(
            "booking.success.message",
            "Ti aspettiamo in negozio. Abbiamo inviato una conferma alla tua email."
          )}
        </p>
        <a
          href="/"
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          {t("nav.home", "Torna alla Home")}
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          {t("booking.title", "Book Your Repair")}
        </h1>
        <p className="text-slate-500 text-lg">
          {t("booking.desc", "Skip the line. We'll be ready for you.")}
        </p>
      </div>

      {/* Error Message */}
      {actionData?.error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-shake">
          <AlertCircle className="size-5" />
          <span>{actionData.error}</span>
        </div>
      )}

      {/* Main Form */}
      <Form method="post" className="space-y-8">
        {/* Step 1: Device Info */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <Smartphone className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">
              {t("booking.form.device_info", "Dispositivo")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("booking.form.device", "Device Model")}
              </label>
              <input
                name="deviceModel"
                type="text"
                required
                placeholder="iPhone 15, Samsung S24..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("booking.form.issue", "Problem")}
              </label>
              <input
                name="problemDescription"
                type="text"
                required
                placeholder={t(
                  "booking.form.issue_placeholder",
                  "Broken screen, Battery..."
                )}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Date & Time Selection (The Custom UI) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <Calendar className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">
              {t("booking.form.datetime_title", "Data e Ora")}
            </h3>
          </div>

          {/* Hidden Inputs for Form Submission */}
          <input
            type="hidden"
            name="selectedDate"
            value={selectedDate}
            required
          />
          <input
            type="hidden"
            name="selectedTime"
            value={selectedTime}
            required
          />

          {/* Custom Date Picker (Horizontal Scroll) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              {t("booking.select_date", "Seleziona Giorno")}
            </label>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {dateList.map((date) => (
                <button
                  key={date.fullDate}
                  type="button"
                  onClick={() => setSelectedDate(date.fullDate)}
                  className={`
                    shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 snap-start
                    ${
                      selectedDate === date.fullDate
                        ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200 scale-105"
                        : "bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50"
                    }
                  `}
                >
                  <span className="text-xs font-medium opacity-80 uppercase tracking-wide">
                    {date.dayName}
                  </span>
                  <span className="text-2xl font-bold my-1">{date.dayNum}</span>
                  <span className="text-xs opacity-60">{date.monthName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker (Grid) */}
          <div
            className={`transition-all duration-500 ${
              selectedDate
                ? "opacity-100"
                : "opacity-50 pointer-events-none filter blur-sm"
            }`}
          >
            <label className="block text-sm font-medium text-slate-700 mb-3">
              {t("booking.select_time", "Orario")}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-2 rounded-lg text-sm font-semibold border transition-all
                    ${
                      selectedTime === time
                        ? "bg-primary-100 text-primary-700 border-primary-500 ring-1 ring-primary-500"
                        : "bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
            {!selectedDate && (
              <p className="text-xs text-amber-600 mt-2 font-medium animate-pulse">
                * {t("booking.select_date_first", "Seleziona prima una data")}
              </p>
            )}
          </div>
        </section>

        {/* Step 3: Personal Info */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <User className="size-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">
              {t("booking.form.contact_info", "I tuoi dati")}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("booking.form.name", "Nome e Cognome")}
              </label>
              <input
                name="customerName"
                type="text"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("booking.form.phone", "Telefono")}
                </label>
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="+39 333..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("booking.form.email", "Email")}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !selectedDate || !selectedTime}
            className={`
              w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all
              ${
                isSubmitting || !selectedDate || !selectedTime
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-linear-to-r from-primary-600 to-emerald-500 hover:from-primary-500 hover:to-emerald-400 hover:shadow-primary-500/30 transform hover:-translate-y-1"
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                Processing...
              </span>
            ) : (
              t("booking.submit_btn", "Conferma Prenotazione")
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Booking;
