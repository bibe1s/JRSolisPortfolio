// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { otpStore } from '@/lib/otpStore';

// Create JWT token
async function createToken(email: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    console.log('🔍 Verifying OTP for:', email);
    console.log('🔍 Code provided:', code);
    console.log('📦 Current OTP store:', Array.from(otpStore.entries()));

    // Verify it's the admin email
    if (email !== process.env.ADMIN_EMAIL) {
      console.log('❌ Unauthorized email');
      return NextResponse.json(
        { error: 'Unauthorized email' },
        { status: 403 }
      );
    }

    // Get stored OTP
    const stored = otpStore.get(email);

    if (!stored) {
      console.log('❌ No OTP found in store');
      return NextResponse.json(
        { error: 'No OTP found. Please request a new code.' },
        { status: 400 }
      );
    }

    console.log('✅ Found stored OTP:', stored.code);
    console.log('⏰ Expires at:', new Date(stored.expires));

    // Check if expired
    if (Date.now() > stored.expires) {
      console.log('❌ OTP expired');
      otpStore.delete(email);
      return NextResponse.json(
        { error: 'OTP expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify code
    if (stored.code !== code) {
      console.log('❌ Invalid code');
      return NextResponse.json(
        { error: 'Invalid code. Please try again.' },
        { status: 400 }
      );
    }

    console.log('✅ Code verified!');

    // Code is valid! Clear it and create session
    otpStore.delete(email);

    // Create JWT token
    const token = await createToken(email);

    console.log('✅ Token created, login successful!');

    return NextResponse.json({
      success: true,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}