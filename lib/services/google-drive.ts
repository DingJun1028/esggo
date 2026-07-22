import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    console.warn('Google Drive credentials not found, using mock client.');
    return null;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

export async function uploadToDrive(fileName: string, content: Buffer, mimeType: string = 'application/pdf') {
  const drive = await getDriveClient();
  
  if (!drive) {
    console.log(`Mock: Uploading ${fileName} to Google Drive...`);
    return { id: `mock-drive-id-${Date.now()}`, webViewLink: '#' };
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata = {
    name: fileName,
    parents: folderId ? [folderId] : [],
  };

  const media = {
    mimeType,
    body: content,
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return response.data;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw error;
  }
}
