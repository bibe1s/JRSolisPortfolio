// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { v2 as cloudinary } from 'cloudinary';

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify JWT token
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

// POST - Upload image to Cloudinary
export async function POST(request: NextRequest) {
  console.log('🔍 Upload API called');
  
  const user = await verifyToken(request);
  
  if (!user) {
    console.log('❌ Unauthorized - no valid token');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  console.log('✅ User authenticated');

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log('📁 File received:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('📤 Uploading to Cloudinary...');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Upload to Cloudinary using upload_stream
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful!');
            resolve(result);
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(buffer);
    });

    console.log('✅ Image uploaded to Cloudinary:', result.secure_url);

    // ✅ Return Cloudinary URL (NOT Base64!)
    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      fileSize: file.size,
      width: result.width,
      height: result.height
    });

  } catch (error) {
    console.error('❌ Upload failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}