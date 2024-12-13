import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (
  image: string,
  folderPath: string,
  slug: string
): Promise<string[]> => {
  try {
    const uploadedImages: string[] = [];

    const uploadResponse = await cloudinary.v2.uploader.upload(image, {
      public_id: generateCloudinaryPublicID(slug),
      folder: folderPath,
    });

    uploadedImages.push(uploadResponse.public_id);
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<{ result: string }> => {
  try {
    const response = await cloudinary.v2.uploader.destroy(publicId);

    if (response.result !== "ok") {
      console.error("Image deletion failed:", response);
      throw new Error("Image Deletion Failed");
    }

    return response;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Image Deletion Failed");
  }
};

export const getCloudinaryImageUrlFromPublicId = (publicId: string): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};

export function extractCloudinaryPublicId(url: string): string {
  const baseUrlPattern =
    /https?:\/\/res.cloudinary.com\/[^\/]+\/image\/upload\/(?:v\d+\/)?/;
  let publicIdWithExtension = url.replace(baseUrlPattern, "");

  const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    publicIdWithExtension = publicIdWithExtension.substring(0, lastDotIndex);
  }

  return publicIdWithExtension;
}

export function generateCloudinaryPublicID(name: string) {
  return `${name}_${uuidv4()}`;
}
