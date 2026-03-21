import * as admin from "firebase-admin";

if (!admin.apps.length) {
  let credential;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (privateKey && clientEmail && projectId) {
    // Robust parsing for Vercel / Production deployment
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      // Handle both literal \n and actual newlines, and strip any accidental quotes
      privateKey: privateKey.replace(/\\n/g, '\n').replace(/"/g, ''),
    });
  } else {
    // Local development fallback
    try {
      const serviceAccount = require("../app/Credential_ServiceAccount/internal-hacka-firebase-adminsdk-fbsvc-0707ffb503.json");
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.warn("Firebase Admin environment variables missing and local service account JSON not found. Admin APIs will fail.");
    }
  }

  if (credential) {
    admin.initializeApp({
      credential,
      // You can optionally add databaseURL if you use the Realtime Database
      // storageBucket: "internal-hacka.firebasestorage.app"
    });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin;
