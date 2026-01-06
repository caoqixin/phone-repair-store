import { ActionFunctionArgs } from "react-router";

export async function bookingAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const bookingTime = `${data.selectedDate}T${data.selectedTime}:00`;

  const payload = {
    customerName: data.customerName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    deviceModel: data.deviceModel,
    problemDescription: data.issueDescription,
    bookingTime: bookingTime,
    status: "pending",
  };

  try {
    const response = await fetch(`${baseUrl}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!result.success) {
      return { error: result.error || "Submission failed" };
    }

    return { success: true, bookingId: result.data?.id };
  } catch (err) {
    return { error: "Network error. Please try again." };
  }
}
