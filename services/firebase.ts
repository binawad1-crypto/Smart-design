/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDC0YZ9jKXnSXD4RDGqqpy63TO1XaO-9Cc",
  authDomain: "smart-design-5d7cb.firebaseapp.com",
  projectId: "smart-design-5d7cb",
  storageBucket: "smart-design-5d7cb.firebasestorage.app",
  messagingSenderId: "19135138242",
  appId: "1:19135138242:web:7287c16287c5df56e2ee5b",
  measurementId: "G-G7K2BTR953"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics (optional, might fail in some environments if blocked)
let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Firebase Analytics initialization failed", e);
}

export const auth = getAuth(app);
export default app;