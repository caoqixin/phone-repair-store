import { redirect } from "react-router";
import { isAuthenticated } from "../services/auth.service";

export async function loginLoader() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/auth/setup-status`);
    const data = await res.json();
    if (!data.initialized) {
      return redirect("/admin/setup");
    }
  } catch (e) {
    // 网络错误忽略
  }

  if (isAuthenticated()) {
    throw redirect("/admin/dashboard");
  }
  return null;
}
