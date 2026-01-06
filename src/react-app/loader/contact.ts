import { BusinessHour, Holiday, Settings } from "../types";

export interface ContactData {
  settings: Settings;
  businessHours: BusinessHour[];
  holidays: Holiday[];
}

export async function contactLoader(): Promise<ContactData> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const [settingsRes, businessHoursRes, holidaysRes] = await Promise.all([
      fetch(`${baseUrl}/settings`),
      fetch(`${baseUrl}/business-hours`),
      fetch(`${baseUrl}/holidays`),
    ]);

    const [settingsData, businessHoursData, holidaysData] = await Promise.all([
      settingsRes.json(),
      businessHoursRes.json(),
      holidaysRes.json(),
    ]);

    return {
      settings: settingsData.success ? settingsData.data : {},
      businessHours: businessHoursData.success ? businessHoursData.data : [],
      holidays: holidaysData.success ? holidaysData.data : [],
    };
  } catch (error) {
    console.error("Contact loader failed:", error);
    return { settings: {}, businessHours: [], holidays: [] };
  }
}
