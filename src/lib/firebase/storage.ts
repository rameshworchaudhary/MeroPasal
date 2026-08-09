import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, storage } from "./config";

/**
 * Compress and convert an image file to a lightweight JPEG Data URL.
 * Keeps max dimension to 1200px and quality 0.85 (~80KB - 200KB).
 */
export async function compressAndConvertToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof window === "undefined" || !e.target?.result) {
        resolve((e.target?.result as string) || "");
        return;
      }

      const img = document.createElement("img");
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = e.target.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a single image file to Firebase Storage under a given folder.
 * If Firebase Storage direct upload is restricted or fails (e.g. storage/unauthorized),
 * falls back seamlessly to a compressed Data URL string.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const path = `${folder}/${timestamp}_${safeName}`;
  const metadata = {
    contentType: file.type || "image/jpeg",
  };

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("User not authenticated for Firebase Storage. Falling back to local compressed image Data URL.");
      return await compressAndConvertToDataUrl(file);
    }

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error: unknown) {
    console.warn("Firebase Storage direct upload failed or unauthorized. Using compressed Data URL fallback:", error);
    return await compressAndConvertToDataUrl(file);
  }
}

/**
 * Upload multiple images in parallel, returning their download URLs or compressed Data URLs in order.
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


