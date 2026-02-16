import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { trainingInquirySchema } from '@/lib/validations';
import { TrainingInquiryEmail, TrainingConfirmationEmail } from '@/components/emails/AdditionalEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = trainingInquirySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    const data = validationResult.data;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'training@yourdomain.com',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `Training Inquiry: ${data.companyName}`,
      react: TrainingInquiryEmail(data),
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'training@yourdomain.com',
      to: data.contactEmail,
      subject: 'Training Inquiry Received',
      react: TrainingConfirmationEmail(data),
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Training inquiry error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}