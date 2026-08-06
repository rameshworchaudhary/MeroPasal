import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, storage } from "./config";

/**
 * Upload a single image file directly to Firebase Storage under a given folder.
 * Requires the user to be logged in via Firebase Auth.
 * Returns the actual Firebase Storage public download URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error(
      "Authentication required: You must be logged in to upload files to Firebase Storage."
    );
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const path = `${folder}/${timestamp}_${safeName}`;
  const metadata = {
    contentType: file.type || "image/jpeg",
  };

  const storageRef = ref(storage, path);
  
  try {
    await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error: unknown) {
    console.error("Firebase Storage Upload Error:", error);
    throw error;
  }
}

/**
 * Upload multiple images in parallel, returning their download URLs in order.
 */
export async function uploadMultipleImages(files: File[], folder: string): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
}

/**
 * Delete an image from Firebase Storage given its full download URL.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url || !url.includes("firebasestorage.googleapis.com")) return;
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn("Storage delete failed (image may already be deleted or invalid URL):", err);
  }
}

