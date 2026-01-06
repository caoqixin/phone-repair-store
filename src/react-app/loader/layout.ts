import { BusinessHour, Holiday, Settings } from "../types";

export interface LayoutData {
  settings: Settings;
  businessHours: BusinessHour[];
  holidays: Holiday[];
}

export async function layoutLoader() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    // 并行获取所有基础数据
    const [settingsRes, businessHoursRes, holidaysRes] = await Promise.all([
      fetch(`${baseUrl}/settings`),
      fetch(`${baseUrl}/business-hours`),
      fetch(`${baseUrl}/holidays`),
    ]);

    const [settings, businessHours, holidays] = await Promise.all([
      settingsRes.json(),
      businessHoursRes.json(),
      holidaysRes.json(),
    ]);

    return {
      settings: settings.success ? settings.data : {},
      businessHours: businessHours.success ? businessHours.data : [],
      holidays: holidays.success ? holidays.data : [],
    };
  } catch (error) {
    console.error("Layout loader failed:", error);
    return { settings: {}, businessHours: [], holidays: [] };
  }
}
