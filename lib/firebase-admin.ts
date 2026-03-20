import * as admin from "firebase-admin";

if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Vercel / Production deployment using environment variables
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace literal string "\n" with actual line breaks for Vercel
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } else {
    // Local development fallback
    try {
      const serviceAccount = require("../app/Credential_ServiceAccount/internal-hacka-firebase-adminsdk-fbsvc-0707ffb503.json");
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.error("Firebase Admin credentials not found. Ensure env vars or local service account JSON exists.");
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
export const adminStorage = admin.storage();

export default admin;
