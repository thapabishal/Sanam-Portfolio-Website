import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Button } from '@react-email/components';

interface Props {
  name: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  confirmationNumber: string;
}

const SERVICE_LABELS: Record<string, string> = {
  bridal: 'Bridal Makeup', editorial: 'Editorial Makeup', sfx: 'Special Effects',
  glam: 'Everyday Glam', consultation: 'Consultation',
};

const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (9am - 12pm)', afternoon: 'Afternoon (12pm - 5pm)',
  evening: 'Evening (5pm - 8pm)', flexible: 'Flexible',
};

export const BeauticianConfirmationEmail = ({
  name, service, preferredDate, preferredTime, confirmationNumber,
}: Props) => {
  const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>Your booking confirmation - {confirmationNumber}</Preview>
      <Body style={{ backgroundColor: '#FAF7F4', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px' }}>
          <Heading style={{ color: '#2C2416', fontSize: '32px', fontWeight: 700, margin: '40px 0 20px', padding: '0 40px', textAlign: 'center' }}>
            Booking Request Received ✨
          </Heading>
          
          <Text style={{ color: '#2C2416', fontSize: '18px', fontWeight: 500, padding: '0 40px', margin: '20px 0 10px' }}>
            Hi {name},
          </Text>
          
          <Text style={{ color: '#525f7f', fontSize: '16px', lineHeight: '24px', padding: '0 40px', margin: '10px 0' }}>
            We've received your booking request and are excited to work with you!
          </Text>

          <Section style={{ backgroundColor: '#C9A87C', borderRadius: '12px', padding: '24px', margin: '30px 40px', textAlign: 'center' }}>
            <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Confirmation Number
            </Text>
            <Text style={{ color: '#ffffff', fontSize: '28px', fontWeight: 700, margin: 0, fontFamily: 'monospace', letterSpacing: '2px' }}>
              {confirmationNumber}
            </Text>
          </Section>

          <Heading style={{ color: '#C9A87C', fontSize: '22px', fontWeight: 600, margin: '30px 0 15px', padding: '0 40px' }}>
            Booking Details
          </Heading>
          
          <Section style={{ backgroundColor: '#FAF7F4', borderRadius: '8px', padding: '20px', margin: '10px 40px' }}>
            <Text style={{ color: '#2C2416', fontSize: '15px', margin: '8px 0', lineHeight: '22px' }}>
              <strong>Service:</strong> {SERVICE_LABELS[service] || service}<br />
              <strong>Date:</strong> {formattedDate}<br />
              <strong>Time:</strong> {TIME_LABELS[preferredTime] || preferredTime}
            </Text>
          </Section>

          <Hr style={{ borderColor: '#E8D5C4', margin: '30px 40px' }} />

          <Heading style={{ color: '#C9A87C', fontSize: '22px', fontWeight: 600, margin: '30px 0 15px', padding: '0 40px' }}>
            What Happens Next?
          </Heading>
          
          <Section style={{ padding: '0 40px' }}>
            <Text style={{ color: '#2C2416', fontSize: '15px', lineHeight: '22px', margin: '16px 0' }}>
              <strong>1. Review (Within 24 hours)</strong><br />
              We'll review your request and check availability.
            </Text>
            <Text style={{ color: '#2C2416', fontSize: '15px', lineHeight: '22px', margin: '16px 0' }}>
              <strong>2. Confirmation</strong><br />
              We'll contact you to confirm your appointment.
            </Text>
            <Text style={{ color: '#2C2416', fontSize: '15px', lineHeight: '22px', margin: '16px 0' }}>
              <strong>3. Preparation</strong><br />
              You'll receive pre-appointment instructions.
            </Text>
          </Section>

          <Text style={{ color: '#8898aa', fontSize: '14px', padding: '20px 40px' }}>
            If you have questions, reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BeauticianConfirmationEmail;