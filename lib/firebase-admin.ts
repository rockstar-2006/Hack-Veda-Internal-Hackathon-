import * as admin from "firebase-admin";

if (!admin.apps.length) {
  let credential;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const projectId = (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)?.trim();

  if (privateKey && clientEmail && projectId) {
    // Robust parsing for Vercel / Production deployment
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      // Hard-core normalization for PEM formatting
      // This handles cases where people copy-paste keys as single lines with spaces
      privateKey: privateKey
        .replace(/\\n/g, '\n') // Handle escaped newlines
        .replace(/"/g, '')     // Remove accidental quotes
        .replace(/ /g, '\n')   // Standardize ALL spaces to newlines
        .replace(/-+BEGIN\s+PRIVATE\s+KEY-+/, '-----BEGIN PRIVATE KEY-----')
        .replace(/-+END\s+PRIVATE\s+KEY-+/, '-----END PRIVATE KEY-----'),
    });
  } else if (process.env.NODE_ENV === "development") {
    // Local development fallback (only attempted locally)
    try {
      // Using eval("require") to completely hide this from the Next.js / Vercel build-time bundler
      const saPath = "../app/Credential_ServiceAccount/internal-hacka-firebase-adminsdk-fbsvc-0707ffb503.json";
      const serviceAccount = eval("require")(saPath);
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
