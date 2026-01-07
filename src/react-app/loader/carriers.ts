import { apiGet } from "../services/auth.service";
import { Carrier } from "../types";

export interface CarrierData {
  carriers: Carrier[];
}

export async function carriersLoader(): Promise<CarrierData> {
  try {
    const carriersRes = await apiGet<{ success: boolean; data: Carrier[] }>(
      "/carriers/all"
    );

    return {
      carriers: carriersRes.success ? carriersRes.data : [],
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      carriers: [],
    };
  }
}
