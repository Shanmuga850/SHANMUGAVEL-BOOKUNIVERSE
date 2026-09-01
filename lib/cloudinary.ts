import { v2 as cloudinary } from 'cloudinary'

// Remove invalid CLOUDINARY_URL if present — we use 3 separate keys as you said
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  delete process.env.CLOUDINARY_URL
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary
