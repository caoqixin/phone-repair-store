import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
  Link,
} from "@react-email/components";

interface Props {
  customerName: string;
  deviceModel: string;
  issueDescription: string;
  bookingTime: string; // 格式化的日期时间字符串
}

// --- Styles ---
const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const header = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#111827", // Dark Slate
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
};

const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "2px",
};

const content = {
  padding: "32px 24px",
};

const h2 = {
  color: "#059669", // Emerald 600
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
};

const card = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #e5e7eb",
};

const cardRow = {
  margin: "8px 0",
  fontSize: "15px",
  color: "#1f2937",
};

const label = {
  color: "#6b7280",
  textTransform: "uppercase" as const,
  fontSize: "12px",
  marginRight: "8px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  textAlign: "center" as const,
  padding: "0 24px",
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "10px",
};

const link = {
  color: "#059669",
  fontSize: "12px",
  textDecoration: "underline",
};

export function BookingReceiptTemplate({
  customerName,
  deviceModel,
  issueDescription,
  bookingTime,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Richiesta di prenotazione ricevuta - Luna Tech</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>LUNA TECH</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h2}>Richiesta Ricevuta</Heading>
            <Text style={paragraph}>
              Gentile <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Grazie per aver scelto Luna Tech. Abbiamo ricevuto la tua
              richiesta di appuntamento. Ecco il riepilogo:
            </Text>

            {/* Details Card */}
            <Section style={card}>
              <Text style={cardRow}>
                <strong style={label}>Dispositivo:</strong> {deviceModel}
              </Text>
              <Text style={cardRow}>
                <strong style={label}>Problema:</strong> {issueDescription}
              </Text>
              <Text style={cardRow}>
                <strong style={label}>Data Richiesta:</strong> {bookingTime}
              </Text>
            </Section>

            <Text style={paragraph}>
              La tua prenotazione è attualmente{" "}
              <strong>in attesa di conferma</strong>. Ti invieremo un'email non
              appena i nostri tecnici avranno confermato l'orario.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Luna Tech
              <br />
              Via Ferrarese 149/D 40128 Bologna | Tel: +393314238522
            </Text>
            <Link href="https://www.lunariparazione.com" style={link}>
              Luna Tech
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingReceiptTemplate;
