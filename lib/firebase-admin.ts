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
  } else if (process.env.NODE_ENV === "development") {
    // Local development fallback (only attempted locally)
    try {
      // Use dynamic require to prevent Vercel build-time resolution errors
      const path = "../app/Credential_ServiceAccount/internal-hacka-firebase-adminsdk-fbsvc-0707ffb503.json";
      const serviceAccount = require(`${path}`);
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
       console.warn("Local service account JSON not found. Admin APIs will fail unless env variables are set.");
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
