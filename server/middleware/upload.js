import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if the file is a video/audio or an image
    let resourceType = 'auto';
    if (file.mimetype.startsWith('video') || file.mimetype.startsWith('audio')) {
      resourceType = 'video'; // Cloudinary treats audio as 'video'
    }

    return {
      folder: 'spotibaiii', // The folder in your Cloudinary dashboard
      resource_type: resourceType,
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp3', 'wav', 'mp4'],
    };
  },
});

const upload = multer({ storage });
export default upload;