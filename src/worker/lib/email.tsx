import { Resend } from "resend";
import BookingReceiptTemplate from "../templates/BookingReceiptTemplate";
import BookingConfirmationTemplate from "../templates/BookingConfirmationTemplate";
import BookingCancellationTemplate from "../templates/BookingCancellationTemplate";
import ContactReceiptTemplate from "../templates/ContactReceiptTemplate";
import { render } from "@react-email/render";

// 定义支持的模板类型
type EmailType =
  | "BOOKING_RECEIPT"
  | "BOOKING_CONFIRMATION"
  | "BOOKING_CANCELLATION"
  | "CONTACT_RECEIPT";

interface SendEmailParams {
  to: string;
  type: EmailType;
  props: any;
  env: Env;
}

export async function sendEmail({ to, type, props, env }: SendEmailParams) {
  const resend = new Resend(env.RESEND_API);
  const from = env.EMAIL_FROM || "Luna Tech <onboarding@resend.dev>";

  let subject = "";
  let reactComponent: any;

  switch (type) {
    case "BOOKING_RECEIPT":
      subject = "Richiesta di Prenotazione Ricevuta - Luna Tech";
      reactComponent = await render(<BookingReceiptTemplate {...props} />);
      break;
    case "BOOKING_CONFIRMATION":
      subject = "Conferma Prenotazione - Luna Tech";
      reactComponent = await render(<BookingConfirmationTemplate {...props} />);
      break;
    case "BOOKING_CANCELLATION":
      subject = "Cancellazione Appuntamento - Luna Tech";
      reactComponent = await render(<BookingCancellationTemplate {...props} />);
      break;
    case "CONTACT_RECEIPT":
      subject = "Abbiamo ricevuto il tuo messaggio - Luna Tech";
      reactComponent = await render(<ContactReceiptTemplate {...props} />);
      break;
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html: reactComponent,
    });
    // console.log(`Email sent (${type}) to ${to}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send email (${type}):`, error);
    // 邮件发送失败不应阻塞主流程，返回 false 即可
    return { success: false, error };
  }
}
