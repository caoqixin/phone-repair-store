import { apiGet } from "../services/auth.service";
import {
  Appointment,
  BusinessHour,
  Carrier,
  ContactMessage,
  Holiday,
  ServiceCategory,
  ServiceItem,
} from "../types";

export interface DashboardData {
  appointments: Appointment[];
  messages: ContactMessage[];
  services: ServiceItem[];
  categories: ServiceCategory[];
  carriers: Carrier[];
  businessHours: BusinessHour[];
  holidays: Holiday[];
  settings: Record<string, string>;
}

export async function dashboardLoader(): Promise<DashboardData> {
  try {
    // 并行请求所有数据，极大提升加载速度
    const [
      appointmentsRes,
      messagesRes,
      servicesRes,
      categoriesRes,
      carriersRes,
      businessHoursRes,
      holidaysRes,
      settingsRes,
    ] = await Promise.all([
      apiGet<{ success: boolean; data: Appointment[] }>("/bookings"),
      apiGet<{ success: boolean; data: ContactMessage[] }>("/contacts"),
      apiGet<{ success: boolean; data: ServiceItem[] }>("/services/all"),
      apiGet<{ success: boolean; data: ServiceCategory[] }>("/categories"),
      apiGet<{ success: boolean; data: Carrier[] }>("/carriers/all"),
      apiGet<{ success: boolean; data: BusinessHour[] }>("/business-hours"),
      apiGet<{ success: boolean; data: Holiday[] }>("/holidays/all"),
      apiGet<{ success: boolean; data: Record<string, string> }>("/settings"),
    ]);

    return {
      appointments: appointmentsRes.success ? appointmentsRes.data : [],
      messages: messagesRes.success ? messagesRes.data : [],
      services: servicesRes.success ? servicesRes.data : [],
      categories: categoriesRes.success ? categoriesRes.data : [],
      carriers: carriersRes.success ? carriersRes.data : [],
      businessHours: businessHoursRes.success ? businessHoursRes.data : [],
      holidays: holidaysRes.success ? holidaysRes.data : [],
      settings: settingsRes.success ? settingsRes.data : {},
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      appointments: [],
      messages: [],
      services: [],
      categories: [],
      carriers: [],
      businessHours: [],
      holidays: [],
      settings: {},
    };
  }
}
