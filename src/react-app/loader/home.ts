import {
  BusinessHour,
  Carrier,
  Holiday,
  ServiceItem,
  Settings,
} from "../types";

export interface HomeData {
  settings: Settings;
  services: ServiceItem[];
  carriers: Carrier[];
  businessHours: BusinessHour[];
  holidays: Holiday[];
}

export async function homeLoader() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  try {
    // 并行请求所有数据，极大提升加载速度
    const [
      settingsRes,
      servicesRes,
      carriersRes,
      businessHoursRes,
      holidaysRes,
    ] = await Promise.all([
      fetch(`${baseUrl}/settings`),
      fetch(`${baseUrl}/services`),
      fetch(`${baseUrl}/carriers`),
      fetch(`${baseUrl}/business-hours`),
      fetch(`${baseUrl}/holidays`),
    ]);

    const [settings, services, carriers, businessHours, holidays] =
      await Promise.all([
        settingsRes.json(),
        servicesRes.json(),
        carriersRes.json(),
        businessHoursRes.json(),
        holidaysRes.json(),
      ]);

    return {
      settings: settings.success ? settings.data : {},
      services: services.success ? services.data : [],
      carriers: carriers.success ? carriers.data : [],
      businessHours: businessHours.success ? businessHours.data : [],
      holidays: holidays.success ? holidays.data : [],
    };
  } catch (error) {
    console.error("Home loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      settings: {},
      services: [],
      carriers: [],
      businessHours: [],
      holidays: [],
    };
  }
}
