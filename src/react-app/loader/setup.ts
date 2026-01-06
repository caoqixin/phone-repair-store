import { redirect } from "react-router";

// 如果已经初始化，严禁访问此页，跳去登录
export async function setupLoader() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/auth/setup-status`);
    const data = await res.json();
    if (data.initialized) {
      return redirect("/admin/login");
    }
  } catch (e) {
    // ignore error
  }
  return null;
}
