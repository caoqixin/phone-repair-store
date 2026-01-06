import { ServiceItem } from "../types";

export interface ServiceData {
  services: ServiceItem[];
}

export async function serviceLoader(): Promise<ServiceData> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const [servicesRes] = await Promise.all([fetch(`${baseUrl}/services`)]);

    const [servicesData] = await Promise.all([servicesRes.json()]);

    return {
      services: servicesData.success ? servicesData.data : [],
    };
  } catch (error) {
    console.error("Service loader failed:", error);
    return { services: [] };
  }
}
