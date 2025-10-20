// lib/otpStore.ts
// Shared OTP store (in-memory)
// In production, use Redis or a database

interface OTPData {
  code: string;
  expires: number;
}

export const otpStore = new Map<string, OTPData>();

// Helper to clean up expired OTPs
export function cleanExpiredOTPs() {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expires) {
      otpStore.delete(email);
    }
  }
}