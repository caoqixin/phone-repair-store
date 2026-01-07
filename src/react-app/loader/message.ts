import { apiGet } from "../services/auth.service";
import { ContactMessage } from "../types";

export interface MessageData {
  messages: ContactMessage[];
}

export async function messageLoader(): Promise<MessageData> {
  try {
    // 并行请求所有数据，极大提升加载速度
    const messagesRes = await apiGet<{
      success: boolean;
      data: ContactMessage[];
    }>("/contacts");

    return {
      messages: messagesRes.success ? messagesRes.data : [],
    };
  } catch (error) {
    console.error("Dashboard loader failed:", error);
    // 失败时返回空数据，避免页面崩溃，可以在UI层处理空状态
    return {
      messages: [],
    };
  }
}
