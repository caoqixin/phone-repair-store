import { apiGet } from "../services/auth.service";
import { Appointment } from "../types";

export interface AppointmentData {
  appointments: Appointment[];
}

export async function appointmentsLoader(): Promise<AppointmentData> {
  try {
    // 并行请求所有数据，极大提升加载速度
    const appointmentsRes = await apiGet<{
      success: boolean;
      data: Appointment[];
    }>("/bookings");

    return {
      appointments: appointmentsRes.success ? appointmentsRes.data : [],
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      appointments: [],
    };
  }
}
