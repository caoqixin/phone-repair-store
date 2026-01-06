import { ActionFunctionArgs, redirect } from "react-router";

export async function setupAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const response = await fetch(`${baseUrl}/auth/create-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!result.success) {
      return { error: result.error || "Setup failed" };
    }

    return redirect("/admin/login");
  } catch (error) {
    return { error: "Network error during setup." };
  }
}
