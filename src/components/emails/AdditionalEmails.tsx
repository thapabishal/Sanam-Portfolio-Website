import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components';

export const TrainingInquiryEmail = (data: any) => (
  <Html>
    <Head />
    <Preview>New Training Inquiry from {data.companyName}</Preview>
    <Body style={{ backgroundColor: '#1A1512', fontFamily: 'sans-serif' }}>
      <Container style={{ backgroundColor: '#2C2416', margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px', borderRadius: '8px' }}>
        <Heading style={{ color: '#D7A86E', fontSize: '28px', fontWeight: 700, margin: '40px 0 20px', padding: '0 40px' }}>
          New Training Inquiry ☕
        </Heading>
        
        <Section style={{ backgroundColor: '#1A1512', borderRadius: '8px', padding: '16px', margin: '20px 40px', border: '1px solid #6D4C41' }}>
          <Text style={{ color: '#F5F5F5', fontWeight: 600, margin: 0 }}>
            {data.companyName} • {data.trainingType} • {data.numberOfTrainees} trainees
          </Text>
        </Section>

        <Heading style={{ color: '#D7A86E', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
          Contact Information
        </Heading>
        <Text style={{ color: '#F5F5F5', fontSize: '16px', padding: '0 40px', margin: '10px 0' }}>
          <strong>Contact:</strong> {data.contactName}<br />
          <strong>Email:</strong> {data.contactEmail}<br />
          <strong>Phone:</strong> {data.contactPhone}
        </Text>

        <Hr style={{ borderColor: '#6D4C41', margin: '20px 40px' }} />

        <Heading style={{ color: '#D7A86E', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
          Training Details
        </Heading>
        <Text style={{ color: '#F5F5F5', fontSize: '16px', padding: '0 40px', margin: '10px 0' }}>
          <strong>Type:</strong> {data.trainingType}<br />
          <strong>Trainees:</strong> {data.numberOfTrainees}<br />
          {data.trainingModule && <><strong>Module:</strong> {data.trainingModule}<br /></>}
          <strong>Dates:</strong> {data.preferredDates}<br />
          {data.budget && <><strong>Budget:</strong> {data.budget}</>}
        </Text>

        <Hr style={{ borderColor: '#6D4C41', margin: '20px 40px' }} />

        <Heading style={{ color: '#D7A86E', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
          Message
        </Heading>
        <Section style={{ backgroundColor: '#1A1512', borderLeft: '4px solid #D7A86E', borderRadius: '4px', padding: '16px', margin: '10px 40px' }}>
          <Text style={{ color: '#F5F5F5', fontSize: '15px', margin: 0 }}>{data.message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const TrainingConfirmationEmail = (data: any) => (
  <Html>
    <Head />
    <Preview>Training Inquiry Received</Preview>
    <Body style={{ backgroundColor: '#1A1512', fontFamily: 'sans-serif' }}>
      <Container style={{ backgroundColor: '#2C2416', margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px', borderRadius: '8px' }}>
        <Heading style={{ color: '#F5F5F5', fontSize: '28px', fontWeight: 700, margin: '40px 0 20px', padding: '0 40px' }}>
          Thank You for Your Interest!
        </Heading>
        
        <Text style={{ color: '#F5F5F5', fontSize: '16px', padding: '0 40px', margin: '10px 0' }}>
          Hi {data.contactName},<br /><br />
          We've received your training inquiry for <strong>{data.companyName}</strong>. Our team is reviewing your requirements.
        </Text>

        <Section style={{ backgroundColor: '#6D4C41', borderRadius: '8px', padding: '16px', margin: '20px 40px' }}>
          <Text style={{ color: '#F5F5F5', margin: 0, fontSize: '15px' }}>
            <strong>Training:</strong> {data.trainingType}<br />
            <strong>Trainees:</strong> {data.numberOfTrainees}<br />
            <strong>Dates:</strong> {data.preferredDates}
          </Text>
        </Section>

        <Text style={{ color: '#D7A86E', fontSize: '16px', padding: '0 40px', margin: '20px 0 10px' }}>
          <strong>Next Steps:</strong><br />
          • Review within 1-2 business days<br />
          • Custom proposal with pricing<br />
          • Schedule a consultation call
        </Text>

        <Text style={{ color: '#D7A86E', fontSize: '16px', padding: '0 40px', margin: '20px 0' }}>
          Looking forward to elevating your coffee program!
        </Text>
      </Container>
    </Body>
  </Html>
);

export const ContactFormEmail = (data: any) => (
  <Html>
    <Head />
    <Preview>Contact Form: {data.subject}</Preview>
    <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
      <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px' }}>
        <Heading style={{ color: '#2C2416', fontSize: '28px', fontWeight: 700, margin: '40px 0 20px', padding: '0 40px' }}>
          New Contact Message 💬
        </Heading>
        
        <Text style={{ color: '#525f7f', fontSize: '16px', padding: '0 40px', margin: '10px 0' }}>
          <strong>From:</strong> {data.name}<br />
          <strong>Email:</strong> {data.email}<br />
          {data.phone && <><strong>Phone:</strong> {data.phone}<br /></>}
          {data.category && <><strong>Category:</strong> {data.category}</>}
        </Text>

        <Hr style={{ borderColor: '#E8D5C4', margin: '20px 40px' }} />

        <Heading style={{ color: '#C9A87C', fontSize: '20px', fontWeight: 600, margin: '20px 0 10px', padding: '0 40px' }}>
          Subject: {data.subject}
        </Heading>
        
        <Section style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #C9A87C', borderRadius: '4px', padding: '16px', margin: '10px 40px' }}>
          <Text style={{ color: '#2C2416', fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>{data.message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const ContactConfirmationEmail = (data: any) => (
  <Html>
    <Head />
    <Preview>We received your message</Preview>
    <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
      <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', maxWidth: '600px' }}>
        <Heading style={{ color: '#2C2416', fontSize: '28px', fontWeight: 700, margin: '40px 0 20px', padding: '0 40px' }}>
          Message Received ✓
        </Heading>
        
        <Text style={{ color: '#525f7f', fontSize: '16px', padding: '0 40px', margin: '10px 0' }}>
          Hi {data.name},<br /><br />
          Thank you for reaching out! We've received your message and will respond within 1-2 business days.
        </Text>

        <Section style={{ backgroundColor: '#FAF7F4', borderRadius: '8px', padding: '16px', margin: '20px 40px' }}>
          <Text style={{ color: '#2C2416', margin: 0, fontSize: '15px' }}>
            <strong>Subject:</strong> {data.subject}
          </Text>
        </Section>

        <Text style={{ color: '#8898aa', fontSize: '14px', padding: '20px 40px', textAlign: 'center' }}>
          If your matter is urgent, please call us directly.
        </Text>
      </Container>
    </Body>
  </Html>
);