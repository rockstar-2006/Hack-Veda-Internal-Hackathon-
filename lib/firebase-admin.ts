import * as admin from "firebase-admin";

let adminInitialized = false;

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
      ? keyMatch[1].replace(/\\n/g, '').replace(/\s+/g, '') // Remove both literal \n and actual whitespace
      : privateKey.replace(/\\n/g, '').replace(/\s+/g, '').replace(/-+BEGIN[^-]*-+/, '').replace(/-+END[^-]*-+/, '').replace(/"/g, ''); // Fallback

    try {
      // Robust parsing for Vercel / Production deployment
      credential = admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: `-----BEGIN PRIVATE KEY-----\n${rawKey}\n-----END PRIVATE KEY-----`,
      });

      admin.initializeApp({
        credential,
      });
      adminInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin:", error);
    }
  } else if (process.env.NODE_ENV === "development") {
    // Local development fallback (only attempted locally)
    try {
      // Using eval("require") to completely hide this from the Next.js / Vercel build-time bundler
      const saPath = "../app/Credential_ServiceAccount/internal-hacka-firebase-adminsdk-fbsvc-0707ffb503.json";
      const serviceAccount = eval("require")(saPath);
      credential = admin.credential.cert(serviceAccount);
      
      admin.initializeApp({
        credential,
      });
      adminInitialized = true;
    } catch (error) {
       console.warn("Local service account JSON not found. Admin APIs will fail unless env variables are set.");
    }
  }
}

// Lazy getters to avoid errors at module load time
export const getAdminDb = () => {
  if (!adminInitialized && admin.apps.length === 0) {
    throw new Error("Firebase Admin not initialized. Check your environment variables.");
  }
  return admin.firestore();
};

export const getAdminAuth = () => {
  if (!adminInitialized && admin.apps.length === 0) {
    throw new Error("Firebase Admin not initialized. Check your environment variables.");
  }
  return admin.auth();
};

// Keep old exports for backward compatibility but use the initialized check
export const adminDb = adminInitialized ? admin.firestore() : null;
export const adminAuth = adminInitialized ? admin.auth() : null;

export default admin;
