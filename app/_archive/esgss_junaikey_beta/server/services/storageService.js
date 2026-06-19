// server/services/storageService.js
import { Storage } from '@google-cloud/storage';
import path from 'path';

// Initialize Google Cloud Storage
const storage = new Storage(); // Assumes ADC or GOOGLE_APPLICATION_CREDENTIALS is set

const bucketName = process.env.GCS_BUCKET_NAME;

if (!bucketName) {
  console.warn('[GCS] ⚠️ GCS_BUCKET_NAME environment variable not set. File uploads will fail.');
}

/**
 * Uploads a file to Google Cloud Storage.
 * @param {string} localFilePath - The path to the local file to upload.
 * @param {string} destination - The destination path in the GCS bucket.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
async function uploadFile(localFilePath) {
  if (!bucketName) {
    throw new Error('Google Cloud Storage bucket name is not configured.');
  }

  const destination = `evidence/${path.basename(localFilePath)}`;

  try {
    const [file] = await storage.bucket(bucketName).upload(localFilePath, {
      destination,
      // Optional: To make the file publicly accessible.
      // You might want to control access differently in a real application.
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    console.log(`[GCS] Successfully uploaded ${localFilePath} to ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`[GCS] ??Error uploading file ${localFilePath} to GCS:`, error);
    throw error;
  }
}

/**
 * Deletes a file from Google Cloud Storage.
 * @param {string} storagePath - The full storage path (URL) of the file to delete.
 * @returns {Promise<void>}
 */
async function deleteFile(storagePath) {
  if (!bucketName) {
    console.warn('[GCS] Cannot delete file, bucket name not configured.');
    return;
  }

  try {
    // Extract the object name from the full URL
    const url = new URL(storagePath);
    const objectName = url.pathname.substring(url.pathname.indexOf('/', 1) + 1);

    if (!objectName) {
      throw new Error('Could not parse object name from URL.');
    }

    await storage.bucket(bucketName).file(objectName).delete();
    console.log(`[GCS] Successfully deleted ${objectName} from bucket ${bucketName}.`);
  } catch (error) {
    console.error(`[GCS] ??Failed to delete file ${storagePath}:`, error);
    // We don't re-throw here to avoid breaking a larger process if cleanup fails.
  }
}

export { uploadFile, deleteFile };
