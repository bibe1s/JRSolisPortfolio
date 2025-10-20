// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { otpStore, cleanExpiredOTPs } from '@/lib/otpStore';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Verify it's the admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized email' },
        { status: 403 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP (expires in 10 minutes)
    otpStore.set(email, {
      code: otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Login <onboarding@resend.dev>', // Change this when you verify your domain
      to: email,
      subject: 'Your Portfolio Editor Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Portfolio Editor Login</h2>
          <p style="color: #666; font-size: 16px;">Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'OTP sent to your email' 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export the OTP store for verification route
export { otpStore };