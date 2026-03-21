import * as admin from "firebase-admin";

if (!admin.apps.length) {
  let credential;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const projectId = (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)?.trim();

  if (privateKey && clientEmail && projectId) {
    // Ultimate robust parsing: Strip everything and re-wrap the raw key data
    // Extraction Precision: Capture only the base64 content within the BEGIN/END tags
    const keyMatch = privateKey.match(/-+BEGIN[^-]*-+\s*([\s\S]+?)\s*-+END[^-]*-+/);
    const rawKey = keyMatch 
      ? keyMatch[1].replace(/\s+/g, '') // Content between tags, stripped of whitespace
      : privateKey.replace(/\\n/g, '').replace(/\s+/g, '').replace(/-+BEGIN[^-]*-+/, '').replace(/-+END[^-]*-+/, '').replace(/"/g, ''); // Fallback

    // Robust parsing for Vercel / Production deployment
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: `-----BEGIN PRIVATE KEY-----\n${rawKey}\n-----END PRIVATE KEY-----`,
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
