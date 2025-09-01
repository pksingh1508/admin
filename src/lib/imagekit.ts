// Client-side ImageKit configuration
export const IMAGEKIT_CONFIG = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!
};

// Upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  folder: "/uploads/" // Default upload folder
};
