import { apiGet } from "../services/auth.service";
import { Appointment, ContactMessage } from "../types";

export interface AsideData {
  appointments: Appointment[];
  messages: ContactMessage[];
}

export async function asideLoader(): Promise<AsideData> {
  try {
    // 并行请求所有数据，极大提升加载速度
    const [appointmentsRes, messagesRes] = await Promise.all([
      apiGet<{ success: boolean; data: Appointment[] }>("/bookings"),
      apiGet<{ success: boolean; data: ContactMessage[] }>("/contacts"),
    ]);

    return {
      appointments: appointmentsRes.success ? appointmentsRes.data : [],
      messages: messagesRes.success ? messagesRes.data : [],
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      appointments: [],
      messages: [],
    };
  }
}
