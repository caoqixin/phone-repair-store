import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, CheckCircle, Smartphone, Loader2 } from "lucide-react";

const API_BASE_URL = "/api";

const Booking: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    deviceModel: "",
    problemDescription: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 组合日期和时间
      const bookingDateTime = formData.preferredTime
        ? `${formData.preferredDate}T${formData.preferredTime}:00Z`
        : `${formData.preferredDate}T10:00:00Z`; // 默认上午10点

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          phoneNumber: formData.phoneNumber,
          deviceModel: formData.deviceModel,
          problemDescription: formData.problemDescription,
          bookingTime: bookingDateTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        // 可选：发送确认邮件
        // await sendConfirmationEmail(formData);
      } else {
        setError(data.error || "预约失败，请重试");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError("网络错误，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // 清除错误提示
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="size-24 bg-primary-100 rounded-full flex items-center justify-center mb-6 animate-slide-in">
          <CheckCircle className="size-12 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          {t("booking.success.title")}
        </h2>
        <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
          {t("booking.success.message")}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              customerName: "",
              phoneNumber: "",
              deviceModel: "",
              problemDescription: "",
              preferredDate: "",
              preferredTime: "",
            });
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-emerald-200 transition-all"
        >
          {t("booking.success.new_booking")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {t("booking.title")}
        </h1>
        <p className="text-slate-600 text-lg">{t("booking.desc")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-slide-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("booking.form.name")}
              </label>
              <input
                required
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Mario Rossi"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("booking.form.contact")}
              </label>
              <input
                required
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                type="tel"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="+39 123 456 7890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Smartphone className="size-4" /> {t("booking.form.device")}
              </label>
              <input
                required
                name="deviceModel"
                value={formData.deviceModel}
                onChange={handleChange}
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="iPhone 13, Samsung S22..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("booking.form.issue")}
              </label>
              <input
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder={
                  t("booking.form.issue_placeholder") || "描述问题..."
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="size-4" /> {t("booking.form.date")}
              </label>
              <input
                required
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("booking.form.time")}
              </label>
              <input
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                type="time"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.99] mt-6 flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin size-5" /> : null}
            {t(
              isSubmitting ? "booking.form.submitting" : "booking.form.submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
