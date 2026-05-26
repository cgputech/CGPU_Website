import { ServiceError } from "@/services/errors";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

export async function uploadImage(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new ServiceError(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  const payload = (await response.json()) as CloudinaryUploadResponse & {
    error?: { message: string };
  };

  if (!response.ok || !payload.secure_url) {
    throw new ServiceError(
      payload.error?.message ?? "Failed to upload image to Cloudinary.",
    );
  }

  return payload.secure_url;
}
