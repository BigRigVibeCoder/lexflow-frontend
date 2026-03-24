import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { logger } from "@/lib/logger";

/** Allowed MIME types for upload per SPR-006 T-056V. */
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "text/plain",
]);

/** Allowed file extensions per SPR-006 T-056V. */
const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".txt",
]);

/** Max upload size: 50MB per SPR-006 T-056V. */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** Get storage directory from env or default to ./uploads in dev. */
function getStoragePath(): string {
  return process.env.DOCUMENT_STORAGE_PATH ?? path.join(process.cwd(), "uploads");
}

/** Validate file type and size. Returns error message or null if valid. */
export function validateFile(filename: string, mimeType: string, sizeBytes: number): string | null {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return `File type "${ext}" is not allowed. Accepted: ${[...ALLOWED_EXTENSIONS].join(", ")}`;
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return `MIME type "${mimeType}" is not allowed`;
  }
  if (sizeBytes > MAX_FILE_SIZE) {
    return `File size ${(sizeBytes / 1024 / 1024).toFixed(1)}MB exceeds maximum of 50MB`;
  }
  return null;
}

/** Store a file to disk. Returns UUID-based stored filename. */
export async function storeFile(buffer: Buffer, originalFilename: string): Promise<string> {
  const ext = path.extname(originalFilename).toLowerCase();
  const storedFilename = `${randomUUID()}${ext}`;
  const storagePath = getStoragePath();
  await fs.mkdir(storagePath, { recursive: true });
  const filePath = path.join(storagePath, storedFilename);
  await fs.writeFile(filePath, buffer);
  logger.info({ storedFilename, originalFilename, storagePath }, "document.stored");
  return storedFilename;
}

/** Read a file from disk. Returns buffer or null if not found. */
export async function readFile(storedFilename: string): Promise<Buffer | null> {
  const filePath = path.join(getStoragePath(), storedFilename);
  try {
    return await fs.readFile(filePath);
  } catch {
    logger.warn({ storedFilename }, "document.read.not_found");
    return null;
  }
}

/** Delete a file from disk. Returns true if deleted, false if not found. */
export async function deleteFile(storedFilename: string): Promise<boolean> {
  const filePath = path.join(getStoragePath(), storedFilename);
  try {
    await fs.unlink(filePath);
    logger.info({ storedFilename }, "document.deleted");
    return true;
  } catch {
    logger.warn({ storedFilename }, "document.delete.not_found");
    return false;
  }
}

/** Get storage path for external use. */
export { getStoragePath };
