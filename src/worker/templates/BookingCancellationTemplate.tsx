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
  Button,
} from "@react-email/components";

interface Props {
  customerName: string;
  bookingTime: string;
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
  backgroundColor: "#dc2626",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
}; // Red Header
const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};
const content = { padding: "32px 24px" };
const h2 = {
  color: "#dc2626",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px",
};
const paragraph = { fontSize: "16px", lineHeight: "26px", color: "#374151" };
const alertCard = {
  backgroundColor: "#fef2f2",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "20px 0",
  border: "1px solid #fecaca",
};
const alertText = {
  color: "#991b1b",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
  textDecoration: "line-through",
};
const btnContainer = { textAlign: "center" as const, marginTop: "32px" };
const button = {
  backgroundColor: "#dc2626",
  color: "#fff",
  borderRadius: "8px",
  padding: "12px 24px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const footer = { textAlign: "center" as const, padding: "0 24px 24px" };
const footerText = { fontSize: "12px", color: "#9ca3af" };

export function BookingCancellationTemplate({
  customerName,
  bookingTime,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Cancellazione appuntamento - Luna Tech</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>LUNA TECH</Text>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Appuntamento Cancellato</Heading>
            <Text style={paragraph}>
              Gentile <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Ti informiamo che il tuo appuntamento previsto per:
            </Text>

            <Section style={alertCard}>
              <Text style={alertText}>{bookingTime}</Text>
            </Section>

            <Text style={paragraph}>
              è stato cancellato. Se non sei stato tu a richiedere la
              cancellazione o se desideri riprogrammare, puoi farlo subito
              cliccando qui sotto.
            </Text>

            <Section style={btnContainer}>
              <Button
                style={button}
                href="https://www.lunariparazione.com/bookings"
              >
                Prenota di nuovo
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>Luna Tech - Bologna</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingCancellationTemplate;
