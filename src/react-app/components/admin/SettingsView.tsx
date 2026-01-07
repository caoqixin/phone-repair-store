import { useEffect, useState } from "react";
import { BusinessHour, Holiday } from "../../types";
import { useToast } from "../ToastProvider";
import { apiDelete, apiPost, apiPut } from "../../services/auth.service";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Layout,
  Loader2,
  MapPin,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { Section } from "../Section";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { SettingsData } from "../../loader/settings";

export const SettingsView = () => {
  const { showToast } = useToast();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { settings, businessHours, holidays } = useLoaderData() as SettingsData;

  const [formData, setFormData] = useState<Record<string, string>>(settings);
  const [hours, setHours] = useState<BusinessHour[]>(businessHours);
  const [holidaysList, setHolidaysList] = useState<Holiday[]>(holidays);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isHolidayModalOpen, setHolidayModalOpen] = useState(false);
  const [holidayForm, setHolidayForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  useEffect(() => {
    if (!hasLoaded && Object.keys(settings).length > 0) {
      setFormData(settings);
      setHasLoaded(true);
    }
  }, [settings, hasLoaded]);

  useEffect(() => {
    setHours(businessHours);
  }, [businessHours]);

  useEffect(() => {
    setHolidaysList(holidays);
  }, [holidays]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleHourChange = (dayOfWeek: number, field: string, value: any) => {
    setHours((prev) =>
      prev.map((h) =>
        h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 保存设置
      const updatePromises = Object.entries(formData).map(([key, value]) =>
        apiPut(`/settings/${key}`, { value })
      );

      // 保存营业时间
      const hoursPromises = hours.map((h) =>
        apiPut(`/business-hours/${h.day_of_week}`, {
          isOpen: h.is_open,
          morningOpen: h.morning_open,
          morningClose: h.morning_close,
          afternoonOpen: h.afternoon_open,
          afternoonClose: h.afternoon_close,
        })
      );

      await Promise.all([...updatePromises, ...hoursPromises]);
      showToast("设置已保存");
      revalidator.revalidate();
    } catch (error) {
      console.error("Save settings error:", error);
      showToast("保存失败", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await apiPost("/holidays", {
        name: holidayForm.name,
        startDate: holidayForm.start_date,
        endDate: holidayForm.end_date,
        isActive: 1,
      });
      showToast("节假日已添加");
      setHolidayModalOpen(false);
      setHolidayForm({ name: "", start_date: "", end_date: "" });
      revalidator.revalidate();
    } catch (error) {
      showToast("添加失败", "error");
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    if (!window.confirm("确定删除此节假日?")) return;
    try {
      await apiDelete(`/holidays/${id}`);
      showToast("节假日已删除");
      revalidator.revalidate();
    } catch (error) {
      showToast("删除失败", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSave} className="max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">网站设置</h2>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-900/20 transition-all disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin size-5" /> 保存中...
              </>
            ) : (
              <>
                <Check className="size-5" /> 保存更改
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 店铺信息 */}
          <Section title="店铺信息" icon={Layout}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  店铺名称
                </label>
                <input
                  type="text"
                  value={formData.shop_name || ""}
                  onChange={(e) => handleChange("shop_name", e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Phone Repair Shop"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  店铺地址
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Via Example 123, Milano"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="+39 123 456 7890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="info@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  P.IVA (税号)
                </label>
                <input
                  type="text"
                  value={formData.p_iva || ""}
                  onChange={(e) => handleChange("p_iva", e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="IT12345678901"
                />
              </div>
            </div>
          </Section>

          {/* 网站描述 */}
          <Section title="网站描述" icon={AlertCircle}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  意大利语描述
                </label>
                <textarea
                  value={formData.website_description_it || ""}
                  onChange={(e) =>
                    handleChange("website_description_it", e.target.value)
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg h-20 resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Riparazione professionale..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  中文描述
                </label>
                <textarea
                  value={formData.website_description_cn || ""}
                  onChange={(e) =>
                    handleChange("website_description_cn", e.target.value)
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg h-20 resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="专业智能手机维修..."
                />
              </div>
            </div>
          </Section>
        </div>

        {/* 营业时间 */}
        <Section title="营业时间" icon={Clock}>
          <div className="space-y-3">
            {hours.map((hour) => (
              <div
                key={hour.day_of_week}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
              >
                <div className="w-20 font-bold text-slate-700">
                  {dayNames[hour.day_of_week]}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hour.is_open === 1}
                    onChange={(e) =>
                      handleHourChange(
                        hour.day_of_week,
                        "is_open",
                        e.target.checked ? 1 : 0
                      )
                    }
                    className="size-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-600">开门</span>
                </label>
                {hour.is_open === 1 && (
                  <div className="flex-1 flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={hour.morning_open || ""}
                      onChange={(e) =>
                        handleHourChange(
                          hour.day_of_week,
                          "morning_open",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 border border-slate-200 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={hour.morning_close || ""}
                      onChange={(e) =>
                        handleHourChange(
                          hour.day_of_week,
                          "morning_close",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 border border-slate-200 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <span className="text-slate-400">|</span>
                    <input
                      type="time"
                      value={hour.afternoon_open || ""}
                      onChange={(e) =>
                        handleHourChange(
                          hour.day_of_week,
                          "afternoon_open",
                          e.target.value
                        )
                      }
                      className="px-2 py-1 border border-slate-200 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="午休"
                    />
                    {hour.afternoon_open && (
                      <>
                        <span>-</span>
                        <input
                          type="time"
                          value={hour.afternoon_close || ""}
                          onChange={(e) =>
                            handleHourChange(
                              hour.day_of_week,
                              "afternoon_close",
                              e.target.value
                            )
                          }
                          className="px-2 py-1 border border-slate-200 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* 节假日管理 */}
        <Section title="节假日管理" icon={Calendar}>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-600">设置店铺休息的节假日</p>
              <button
                type="button"
                onClick={() => setHolidayModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1"
              >
                <Plus className="size-3.5" /> 添加节假日
              </button>
            </div>
            <div className="space-y-2">
              {holidaysList.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  暂无节假日
                </p>
              ) : (
                holidaysList.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{h.name}</div>
                      <div className="text-xs text-slate-600">
                        {h.start_date} 至 {h.end_date}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHoliday(h.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        {/* 公告信息 */}
        <Section title="公告栏" icon={AlertCircle}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                意大利语公告
              </label>
              <textarea
                value={formData.announcement_it || ""}
                onChange={(e) =>
                  handleChange("announcement_it", e.target.value)
                }
                className="w-full p-2.5 border border-yellow-300 bg-yellow-50 rounded-lg h-20 resize-none focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="Benvenuti nel nostro negozio!"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                中文公告
              </label>
              <textarea
                value={formData.announcement_cn || ""}
                onChange={(e) =>
                  handleChange("announcement_cn", e.target.value)
                }
                className="w-full p-2.5 border border-yellow-300 bg-yellow-50 rounded-lg h-20 resize-none focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="欢迎光临我们的店铺!"
              />
            </div>
          </div>
        </Section>

        {/* 其他设置 (社交媒体、地图等) */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section title="社交媒体链接" icon={MapPin}>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagram_url || ""}
                  onChange={(e) =>
                    handleChange("instagram_url", e.target.value)
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                  placeholder="https://instagram.com/yourshop"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebook_url || ""}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                  placeholder="https://facebook.com/yourshop"
                />
              </div>
            </div>
          </Section>

          <Section title="其他设置" icon={Settings}>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  地图嵌入 URL
                </label>
                <input
                  type="url"
                  value={formData.map_embed_url || ""}
                  onChange={(e) =>
                    handleChange("map_embed_url", e.target.value)
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-xs"
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo_url || ""}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </Section>
        </div>
      </form>
      {/* 节假日添加 Modal */}
      {isHolidayModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // 点击背景关闭
            if (e.target === e.currentTarget) {
              setHolidayModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">添加节假日</h3>
              <button
                onClick={() => setHolidayModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  节假日名称
                </label>
                <input
                  required
                  value={holidayForm.name}
                  onChange={(e) =>
                    setHolidayForm({ ...holidayForm, name: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="春节、圣诞节..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    开始日期
                  </label>
                  <input
                    required
                    type="date"
                    value={holidayForm.start_date}
                    onChange={(e) =>
                      setHolidayForm({
                        ...holidayForm,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    结束日期
                  </label>
                  <input
                    required
                    type="date"
                    value={holidayForm.end_date}
                    onChange={(e) =>
                      setHolidayForm({
                        ...holidayForm,
                        end_date: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setHolidayModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
