import { initializeApp, getApps } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const initializeFirebase = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
};

export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (!supported) {
    return null;
  }
  const app = initializeFirebase();
  return getMessaging(app);
};
