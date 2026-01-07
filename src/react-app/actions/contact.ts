import { ActionFunctionArgs } from "react-router";

export async function contactAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // 构造 payload
  const payload = {
    name: data.name,
    email: data.email,
    message: data.message,
    token: data["cf-turnstile-response"],
  };

  try {
    const response = await fetch(`${baseUrl}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      return { error: result.error || "Submission failed" };
    }

    return { success: true };
  } catch (err) {
    return { error: "Network error. Please try again later." };
  }
}
