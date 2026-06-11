import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./service-account-key.json', 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function createAdmin() {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'admin@esggo.com',
      emailVerified: true,
      password: 'password123',
      displayName: 'System Admin',
      disabled: false,
    });
    console.log('Successfully created new user:', userRecord.uid);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('User already exists. Updating password...');
      const user = await admin.auth().getUserByEmail('admin@esggo.com');
      await admin.auth().updateUser(user.uid, { password: 'password123' });
      console.log('Successfully updated password for:', user.uid);
    } else {
      console.error('Error creating user:', error);
    }
  }
  process.exit(0);
}

createAdmin();
