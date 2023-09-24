import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { FB_CLIENT_EMAIL, FB_PRIVATE_KEY } from "$env/static/private";
import pkg from "firebase-admin";

try {
  pkg.initializeApp({
    credential: pkg.credential.cert({
      clientEmail: FB_CLIENT_EMAIL,
      privateKey: FB_PRIVATE_KEY,
    }),
  });
} catch (err: any) {
  // Logs any error other than instance already
  // exists, as it may happen many times in development
  if (!/already exists/u.test(err.message)) {
    console.error("Firebase Admin Error: ", err.stack);
  }
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();
