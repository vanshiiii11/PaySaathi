import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAvatar = async (filePath: string, userId: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'paysaathi/avatars',
      public_id: userId,
      overwrite: true,
      transformation: [
        { width: 500, height: 500, crop: 'fill' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Avatar upload failed');
  }
};
