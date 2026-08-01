import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a single image file to Firebase Storage under a given folder.
 * Returns the public download URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const path = `${folder}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
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
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Non-critical: image may already be deleted or URL may be external
  }
}
