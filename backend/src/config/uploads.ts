import path from 'path';
import fs from 'fs';

// Get the uploads directory - use absolute path
export const getUploadsDir = (): string => {
  // If UPLOAD_DIR is set, use it (could be absolute or relative)
  if (process.env.UPLOAD_DIR) {
    const uploadDir = path.isAbsolute(process.env.UPLOAD_DIR)
      ? process.env.UPLOAD_DIR
      : path.resolve(process.cwd(), process.env.UPLOAD_DIR);
    return uploadDir;
  }

  // Default: uploads directory relative to the project root
  // In production, __dirname is in dist/, so go up one level
  const uploadsDir = path.resolve(__dirname, '../../uploads');
  return uploadsDir;
};

// Ensure the uploads directory exists
export const ensureUploadsDir = (): string => {
  const uploadsDir = getUploadsDir();
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`📁 Created uploads directory: ${uploadsDir}`);
  }
  return uploadsDir;
};

export default getUploadsDir;
