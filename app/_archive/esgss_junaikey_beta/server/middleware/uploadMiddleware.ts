import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../src/config/index.js';

// Ensure uploads directory exists
const uploadDir = config.upload?.uploadPath || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Global Multer instance
export const upload = multer({
    dest: uploadDir,
    limits: { fileSize: config.upload?.maxFileSize || 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = config.upload?.allowedTypes || ['pdf', 'png', 'jpg', 'jpeg'];
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed: ${allowed.join(', ')}`));
        }
    },
});
