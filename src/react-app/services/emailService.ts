/**
 * Email Service
 * Integrated with Resend (Stubbed for Development)
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  /**
   * Internal send function (Mock)
   */
  send: async (payload: EmailPayload) => {
    console.groupCollapsed(`📧 [Email Service] Sending to: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.html}`);
    console.groupEnd();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * 1. Booking Request Receipt (To Customer)
   */
  sendBookingRequestReceipt: async (customerEmail: string, customerName: string, date: string, time: string) => {
    return emailService.send({
      to: customerEmail,
      subject: `[LunaTech] Richiesta Prenotazione Ricevuta / 预约申请已收到`,
      html: `
        <p>Ciao ${customerName},</p>
        <p>Abbiamo ricevuto la tua richiesta di appuntamento per il <strong>${date} alle ${time}</strong>.</p>
        <p>Attendi la nostra conferma.</p>
        <hr />
        <p>你好 ${customerName},</p>
        <p>我们已收到您在 <strong>${date} ${time}</strong> 的预约请求。</p>
        <p>请等待我们的确认通知。</p>
      `
    });
  },

  /**
   * 2. Booking Confirmation (To Customer)
   */
  sendBookingConfirmation: async (customerEmail: string, customerName: string, date: string, time: string) => {
    return emailService.send({
      to: customerEmail,
      subject: `[LunaTech] Appuntamento Confermato! / 预约已确认!`,
      html: `
        <p>Ciao ${customerName},</p>
        <p>Il tuo appuntamento è stato <strong>CONFERMATO</strong>.</p>
        <p>Ti aspettiamo il: <strong>${date} alle ${time}</strong></p>
        <hr />
        <p>你好 ${customerName},</p>
        <p>您的预约 <strong>已确认</strong>。</p>
        <p>期待您的光临: <strong>${date} ${time}</strong></p>
      `
    });
  },

  /**
   * 3. Contact Message Receipt (To Visitor)
   */
  sendContactMessageReceipt: async (visitorEmail: string, visitorName: string) => {
    return emailService.send({
      to: visitorEmail,
      subject: `[LunaTech] Messaggio Ricevuto / 留言已收到`,
      html: `
        <p>Grazie ${visitorName},</p>
        <p>Abbiamo ricevuto il tuo messaggio. Ti risponderemo il prima possibile.</p>
        <hr />
        <p>感谢 ${visitorName},</p>
        <p>我们已收到您的留言，会尽快给您回复。</p>
      `
    });
  },

  /**
   * 4. Admin Notification (Mock)
   */
  notifyAdmin: async (type: string, details: string) => {
     return emailService.send({
       to: 'admin@lunatech.it',
       subject: `[Admin Alert] ${type}`,
       html: `<p>${details}</p>`
     });
  }
};