import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Ensure the popup works across browsers
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const allowedDomain = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "@sode-edu.in";

    if (!user.email?.endsWith(allowedDomain)) {
      await firebaseSignOut(auth);
      throw new Error(`Only ${allowedDomain} email addresses are allowed.`);
    }

    return user;
  } catch (error) {
    console.error("Authentication Error:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
};
