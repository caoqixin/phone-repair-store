import { apiGet } from "../services/auth.service";
import { ServiceCategory, ServiceItem } from "../types";

export interface ServicesData {
  services: ServiceItem[];
  categories: ServiceCategory[];
}

export async function servicesLoader(): Promise<ServicesData> {
  try {
    // 并行请求所有数据，极大提升加载速度
    const [servicesRes, categoriesRes] = await Promise.all([
      apiGet<{ success: boolean; data: ServiceItem[] }>("/services/all"),
      apiGet<{ success: boolean; data: ServiceCategory[] }>("/categories"),
    ]);

    return {
      services: servicesRes.success ? servicesRes.data : [],
      categories: categoriesRes.success ? categoriesRes.data : [],
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      services: [],
      categories: [],
    };
  }
}
