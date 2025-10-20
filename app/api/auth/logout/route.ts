// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // In a real app, you might invalidate the token in a database
  // For now, the client will remove the cookie
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}