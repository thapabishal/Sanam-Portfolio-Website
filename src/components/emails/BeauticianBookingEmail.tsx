import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Row, Column } from '@react-email/components';

interface Props {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests?: string;
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

export const BeauticianBookingEmail = ({
  name, email, phone, service, preferredDate, preferredTime, specialRequests, confirmationNumber,
}: Props) => {
  const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>New booking from {name}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px' }}>
          <Heading style={{ color: '#2C2416', fontSize: '28px', fontWeight: 700, margin: '40px 0 20px', padding: '0 40px' }}>
            New Booking Request 📅
          </Heading>
          
          <Section style={{ backgroundColor: '#FAF7F4', borderRadius: '8px', padding: '16px', margin: '20px 40px' }}>
            <Text style={{ color: '#2C2416', fontSize: '18px', fontWeight: 600, margin: 0, textAlign: 'center' }}>
              Confirmation #: <strong>{confirmationNumber}</strong>
            </Text>
          </Section>

          <Heading style={{ color: '#C9A87C', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
            Client Information
          </Heading>
          
          <Section style={{ padding: '0 40px' }}>
            <Row>
              <Column style={{ width: '140px' }}>
                <Text style={{ color: '#8898aa', fontSize: '14px', fontWeight: 600, margin: '4px 0' }}>Name:</Text>
              </Column>
              <Column>
                <Text style={{ color: '#2C2416', fontSize: '16px', margin: '4px 0' }}>{name}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '140px' }}>
                <Text style={{ color: '#8898aa', fontSize: '14px', fontWeight: 600, margin: '4px 0' }}>Email:</Text>
              </Column>
              <Column>
                <Text style={{ color: '#2C2416', fontSize: '16px', margin: '4px 0' }}>
                  <a href={`mailto:${email}`} style={{ color: '#C9A87C' }}>{email}</a>
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: '140px' }}>
                <Text style={{ color: '#8898aa', fontSize: '14px', fontWeight: 600, margin: '4px 0' }}>Phone:</Text>
              </Column>
              <Column>
                <Text style={{ color: '#2C2416', fontSize: '16px', margin: '4px 0' }}>
                  <a href={`tel:${phone}`} style={{ color: '#C9A87C' }}>{phone}</a>
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#E8D5C4', margin: '20px 40px' }} />

          <Heading style={{ color: '#C9A87C', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
            Booking Details
          </Heading>
          
          <Section style={{ padding: '0 40px' }}>
            <Text style={{ color: '#525f7f', fontSize: '16px', margin: '10px 0' }}>
              <strong>Service:</strong> {SERVICE_LABELS[service] || service}<br />
              <strong>Date:</strong> {formattedDate}<br />
              <strong>Time:</strong> {TIME_LABELS[preferredTime] || preferredTime}
            </Text>
          </Section>

          {specialRequests && (
            <>
              <Hr style={{ borderColor: '#E8D5C4', margin: '20px 40px' }} />
              <Heading style={{ color: '#C9A87C', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
                Special Requests
              </Heading>
              <Section style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #C9A87C', borderRadius: '4px', padding: '16px', margin: '10px 40px' }}>
                <Text style={{ color: '#2C2416', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>{specialRequests}</Text>
              </Section>
            </>
          )}

          <Text style={{ color: '#8898aa', fontSize: '14px', padding: '20px 40px', textAlign: 'center' }}>
            Please respond within 24 hours.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BeauticianBookingEmail;