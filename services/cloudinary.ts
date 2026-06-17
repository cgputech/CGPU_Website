import { ServiceError } from "@/services/errors";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as { secure_url?: string; error?: string };

  if (!response.ok || !payload.secure_url) {
    throw new ServiceError(
      payload.error ?? "Failed to upload image to Cloudinary.",
    );
  }

  return payload.secure_url;
}
