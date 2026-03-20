import * as admin from "firebase-admin";

const serviceAccount = require("../app/Credential_ServiceAccount/internal-hacka-firebase-adminsdk-fbsvc-0707ffb503.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // You can optionally add databaseURL if you use the Realtime Database
    // storageBucket: "internal-hacka.firebasestorage.app"
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();

export default admin;
