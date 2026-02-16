import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/validations';
import { ContactFormEmail, ContactConfirmationEmail } from '@/components/emails/AdditionalEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        })),

      }, { status: 400 });
    }

    const data = validationResult.data;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@yourdomain.com',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      replyTo: data.email,
      subject: `Contact: ${data.subject}`,
      react: ContactFormEmail(data),
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@yourdomain.com',
      to: data.email,
      subject: 'We received your message',
      react: ContactConfirmationEmail(data),
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}