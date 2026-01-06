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
  Button,
} from "@react-email/components";

interface Props {
  customerName: string;
  bookingTime: string;
}

// Styles (Reuse common styles + specific ones)
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
  backgroundColor: "#059669",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
}; // Emerald Green Header
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
const highlightCard = {
  backgroundColor: "#ecfdf5",
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "24px 0",
  border: "1px dashed #059669",
};
const dateLabel = {
  color: "#059669",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "8px",
  display: "block",
};
const dateText = {
  color: "#064e3b",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};
const btnContainer = { textAlign: "center" as const, marginTop: "32px" };
const button = {
  backgroundColor: "#111827",
  color: "#fff",
  borderRadius: "8px",
  padding: "12px 24px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const footer = { textAlign: "center" as const, padding: "0 24px 24px" };
const footerText = { fontSize: "12px", color: "#9ca3af", marginBottom: "10px" };
const link = { color: "#059669", fontSize: "12px" };

export function BookingConfirmationTemplate({
  customerName,
  bookingTime,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>La tua prenotazione è confermata! - Luna Tech</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>LUNA TECH</Text>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Prenotazione Confermata ✅</Heading>
            <Text style={paragraph}>
              Ciao <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Siamo felici di confermare il tuo appuntamento. Ecco quando ti
              aspettiamo:
            </Text>

            {/* Time Highlight Card */}
            <Section style={highlightCard}>
              <Text style={dateLabel}>DATA E ORA</Text>
              <Text style={dateText}>{bookingTime}</Text>
            </Section>

            <Text style={paragraph}>
              Per favore, cerca di arrivare 5 minuti prima. Se hai bisogno di
              cambiare orario, contattaci telefonicamente.
            </Text>

            <Section style={btnContainer}>
              <Button
                style={button}
                href="https://maps.google.com/?q=Luna+Tech+Bologna"
              >
                Indicazioni Stradali
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>Luna Tech - Bologna</Text>
            <Link href="https://www.lunariparazione.com" style={link}>
              Luna Tech
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmationTemplate;
