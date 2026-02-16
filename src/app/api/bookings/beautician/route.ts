import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { beauticianBookingSchema } from '@/lib/validations';
import { BeauticianBookingEmail } from '@/components/emails/BeauticianBookingEmail';
import { BeauticianConfirmationEmail } from '@/components/emails/BeauticianConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateConfirmationNumber(): string {
  const prefix = 'BK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = beauticianBookingSchema.safeParse(body);

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
    const confirmationNumber = generateConfirmationNumber();

    // Send to admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'bookings@yourdomain.com',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `New Booking: ${data.service} - ${data.name}`,
      react: BeauticianBookingEmail({ ...data, confirmationNumber }),
    });

    // Send to customer
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'bookings@yourdomain.com',
      to: data.email,
      subject: `Booking Confirmation - ${confirmationNumber}`,
      react: BeauticianConfirmationEmail({ ...data, confirmationNumber }),
    });

    return NextResponse.json({
      success: true,
      message: 'Booking request received',
      data: { confirmationNumber },
    }, { status: 200 });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}