import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (file, options = {}) => {
  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: process.env.CLOUDINARY_FOLDER || 'images',
    resource_type: 'image',
    ...options,
  });

  await fs.unlink(file.path).catch(() => {});
  return response.secure_url;
};
