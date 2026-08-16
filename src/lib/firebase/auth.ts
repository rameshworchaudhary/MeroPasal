import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "@/lib/types/user";
import { validateEmailClient } from "@/lib/emailValidation";

/**
 * Helper to get ActionCodeSettings pointing to custom action handler.
 */
function getActionCodeSettings(): { url: string; handleCodeInApp: boolean } {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://nexshoponline.com.np");
  return {
    url: `${baseUrl}/auth/action`,
    handleCodeInApp: true,
  };
}

/**
 * Register a new user with email/password and create their Firestore profile.
 * Sends email verification after registration.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  phone?: string,
  role: "customer" | "seller" = "customer",
  sellerProfile?: Record<string, any>
): Promise<User> {
  // 1. Client-side validation check
  const clientVal = validateEmailClient(email);
  if (!clientVal.valid) {
    throw new Error(clientVal.error || "Please enter a valid email address.");
  }

  // 2. Server API validation check (validates format, disposable provider, and domain)
  try {
    const res = await fetch("/api/auth/validate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.valid) {
      throw new Error(data.error || "Please enter a valid email address.");
    }
  } catch (err: any) {
    if (
      err.message === "Temporary or disposable email addresses are not allowed." ||
      err.message === "Please enter a valid email address."
    ) {
      throw err;
    }
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserProfileDocument(credential.user, { displayName, phone, role, sellerProfile });

  // Send verification email
  try {
    await sendEmailVerification(credential.user, getActionCodeSettings());
  } catch {
    // Don't block registration if email fails
    console.warn("Could not send verification email");
  }

  return credential.user;
}

/**
 * Sign in an existing user with email/password.
 * Enforces email verification before proceeding.
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  
  if (!credential.user.emailVerified) {
    // Sign out unverified session
    await firebaseSignOut(auth);
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return credential.user;
}

/**
 * Sign in with Google popup. Creates a Firestore profile if first-time user.
 */
export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const credential = await signInWithPopup(auth, provider);
    await createUserProfileDocument(credential.user, {
      displayName: credential.user.displayName || "User",
    });
    return credential.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    const code = error?.code || "";
    if (code === "auth/popup-blocked") {
      throw new Error("Popup blocked by browser. Please allow popups or open this app in a new browser tab.");
    } else if (code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in popup was closed before completing.");
    } else if (code === "auth/operation-not-allowed") {
      throw new Error("Google Sign-In is not enabled in Firebase Console. Enable Google under Auth > Sign-in method.");
    } else if (code === "auth/unauthorized-domain") {
      throw new Error("Domain not authorized in Firebase Console. Add this URL under Auth > Settings > Authorized domains.");
    } else if (code === "auth/cancelled-popup-request") {
      throw new Error("Sign-in popup request was cancelled.");
    } else if (error?.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Google authentication failed. Please try again or open the app in a new browser tab.");
    }
  }
}

/**
 * Sign the current user out.
 */
export async function logout(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Send a password reset email using custom action link.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email, getActionCodeSettings());
}

/**
 * Resend verification email to current user.
 */
export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  if (user.emailVerified) throw new Error("Email already verified");
  await sendEmailVerification(user, getActionCodeSettings());
}

/**
 * Resend verification email given user email and password.
 */
export async function resendVerificationForEmail(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (credential.user.emailVerified) {
    await firebaseSignOut(auth);
    throw new Error("EMAIL_ALREADY_VERIFIED");
  }
  await sendEmailVerification(credential.user, getActionCodeSettings());
  await firebaseSignOut(auth);
}

/**
 * Create a Firestore user profile document if one does not already exist.
 */
export async function createUserProfileDocument(
  user: User,
  extra?: {
    displayName?: string;
    phone?: string;
    role?: "customer" | "seller";
    sellerProfile?: Record<string, any>;
  }
): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const newProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: extra?.displayName || user.displayName || "User",
      phone: extra?.phone || "",
      photoURL: user.photoURL || "",
      role: extra?.role || ("customer" as const),
      ...(extra?.sellerProfile ? { sellerProfile: extra.sellerProfile } : {}),
      addresses: [],
      wishlist: [],
      recentlyViewed: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile);
  }
}

/**
 * Fetch the Firestore user profile for the given UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as UserProfile;
}

/**
 * Subscribe to Firebase auth state changes.
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}