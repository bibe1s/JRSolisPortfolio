// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';
import { defaultProfile } from '@/lib/defaultProfile';

// Helper to verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.email !== process.env.ADMIN_EMAIL) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// GET - Load profile (public, no auth needed)
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Get profile
    const result = await sql`
      SELECT data FROM portfolio 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    // If no data, insert default
    if (result.length === 0) {
      await sql`
        INSERT INTO portfolio (data)
        VALUES (${JSON.stringify(defaultProfile)})
      `;
      return NextResponse.json(defaultProfile);
    }
    
    return NextResponse.json(result[0].data);
  } catch (error) {
    console.error('Failed to load profile:', error);
    return NextResponse.json(defaultProfile);
  }
}

// POST - Save profile (requires authentication)
export async function POST(request: NextRequest) {
  // Verify authentication
  const user = await verifyToken(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const profile = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if table exists and has data
    const result = await sql`
      SELECT id FROM portfolio 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    if (result.length === 0) {
      // Insert new
      await sql`
        INSERT INTO portfolio (data)
        VALUES (${JSON.stringify(profile)})
      `;
    } else {
      // Update existing
      await sql`
        UPDATE portfolio 
        SET data = ${JSON.stringify(profile)}, 
            updated_at = NOW()
        WHERE id = ${result[0].id}
      `;
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile saved successfully' 
    });
  } catch (error) {
    console.error('Failed to save profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}