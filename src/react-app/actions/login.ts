import { ActionFunctionArgs, redirect } from "react-router";
import { login } from "../services/auth.service";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const result = await login(username as string, password as string);

    if (!result.success) {
      return { error: result.error || "邮箱或密码错误" };
    }

    // 跳转 Dashboard
    return redirect("/admin/dashboard");
  } catch (error) {
    return { error: "网络连接失败，请检查后台服务。" };
  }
}
