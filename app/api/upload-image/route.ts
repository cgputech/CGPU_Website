import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import envs from '@/utils/config';

cloudinary.config({
  cloud_name: envs.cloudinary.cloudName,
  api_key: envs.cloudinary.apiKey,
  api_secret: envs.cloudinary.apiSecret,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'uploads' }, // Optional: specify a folder in Cloudinary
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ secure_url: (result as any).secure_url });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed.' }, { status: 500 });
  }
}
