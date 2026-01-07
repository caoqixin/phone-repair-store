import { apiGet } from "../services/auth.service";
import { BusinessHour, Holiday } from "../types";

export interface SettingsData {
  businessHours: BusinessHour[];
  holidays: Holiday[];
  settings: Record<string, string>;
}

export async function settingsLoader(): Promise<SettingsData> {
  try {
    // 并行请求所有数据，极大提升加载速度
    const [businessHoursRes, holidaysRes, settingsRes] = await Promise.all([
      apiGet<{ success: boolean; data: BusinessHour[] }>("/business-hours"),
      apiGet<{ success: boolean; data: Holiday[] }>("/holidays/all"),
      apiGet<{ success: boolean; data: Record<string, string> }>("/settings"),
    ]);

    return {
      businessHours: businessHoursRes.success ? businessHoursRes.data : [],
      holidays: holidaysRes.success ? holidaysRes.data : [],
      settings: settingsRes.success ? settingsRes.data : {},
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      businessHours: [],
      holidays: [],
      settings: {},
    };
  }
}
