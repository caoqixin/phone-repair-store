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
} from "@react-email/components";

interface Props {
  customerName: string;
  message: string;
}

// Styles
const main = { backgroundColor: "#f9fafb", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};
const header = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#111827",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
};
const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};
const content = { padding: "32px 24px" };
const h2 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px",
};
const paragraph = { fontSize: "16px", lineHeight: "26px", color: "#374151" };
const quoteBox = {
  backgroundColor: "#f3f4f6",
  borderLeft: "4px solid #9ca3af",
  padding: "20px",
  margin: "24px 0",
  borderRadius: "4px",
};
const quoteLabel = {
  color: "#6b7280",
  fontSize: "10px",
  fontWeight: "bold",
  letterSpacing: "1px",
  marginBottom: "8px",
};
const quoteText = {
  color: "#4b5563",
  fontSize: "15px",
  fontStyle: "italic",
  margin: "0",
};
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const footer = { textAlign: "center" as const, padding: "0 24px 24px" };
const footerText = { fontSize: "12px", color: "#9ca3af" };
export function ContactReceiptTemplate({ customerName, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Abbiamo ricevuto il tuo messaggio - Luna Tech</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>LUNA TECH</Text>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Messaggio Ricevuto 📩</Heading>
            <Text style={paragraph}>
              Grazie <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Abbiamo ricevuto la tua richiesta. Il nostro team la esaminerà e
              ti risponderà il prima possibile (solitamente entro 24 ore).
            </Text>

            {/* Quote the user's message */}
            <Section style={quoteBox}>
              <Text style={quoteLabel}>IL TUO MESSAGGIO:</Text>
              <Text style={quoteText}>"{message}"</Text>
            </Section>
          </Section>

          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Luna Tech - Bologna
              <br />
              Via Ferrarese 149/D, 40128, Bologna
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactReceiptTemplate;
