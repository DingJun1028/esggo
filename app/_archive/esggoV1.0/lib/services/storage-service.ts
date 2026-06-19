import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    UploadTaskSnapshot,
    StorageError,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadProgress {
    bytesTransferred: number;
    totalBytes: number;
    percentage: number;
    state: "running" | "paused" | "success" | "error" | "canceled";
}

export interface UploadResult {
    downloadUrl: string;
    path: string;
    fileName: string;
}

export type ProgressCallback = (progress: UploadProgress) => void;

// 定義允許上傳的檔案類型與副檔名，防止惡意腳本 (如 .html, .js, .svg, .exe)
const ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/vnd.ms-excel" // xls
]);

/**
 * ESG GO Cloud Storage Service
 * 用於上傳 ESG 憑證、用戶頭像、報告 PDF
 */
export const StorageService = {
    /**
     * 上傳 ESG 憑證文件
     * 路徑: evidence/{uid}/{timestamp}_{fileName}
     */
    uploadEvidenceFile: (
        userId: string,
        file: File,
        onProgress?: ProgressCallback
    ): Promise<UploadResult> => {
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `evidence/${userId}/${Date.now()}_${safeFileName}`;
        return StorageService._upload(path, file, onProgress);
    },

    /**
     * 上傳用戶頭像
     * 路徑: users/{uid}/avatar/{fileName}
     */
    uploadUserAvatar: (
        userId: string,
        file: File,
        onProgress?: ProgressCallback
    ): Promise<UploadResult> => {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `users/${userId}/avatar/avatar.${ext}`;
        return StorageService._upload(path, file, onProgress);
    },

    /**
     * 上傳 ESG 報告 PDF
     * 路徑: reports/{uid}/{reportId}.pdf
     */
    uploadReportPdf: (
        userId: string,
        reportId: string,
        file: File,
        onProgress?: ProgressCallback
    ): Promise<UploadResult> => {
        const path = `reports/${userId}/${reportId}.pdf`;
        return StorageService._upload(path, file, onProgress);
    },

    /**
     * 取得文件下載 URL
     */
    getDownloadUrl: async (path: string): Promise<string> => {
        const fileRef = ref(storage, path);
        return await getDownloadURL(fileRef);
    },

    /**
     * 刪除文件
     */
    deleteFile: async (path: string): Promise<void> => {
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
    },

    /**
     * 內部上傳方法（支援進度回調）
     */
    _upload: (
        path: string,
        file: File,
        onProgress?: ProgressCallback
    ): Promise<UploadResult> => {
        return new Promise((resolve, reject) => {
            // 1. 檔案大小驗證 (上限 50MB)
            if (file.size > 50 * 1024 * 1024) {
                return reject(new Error("檔案大小超過限制 (最大 50MB)"));
            }
            // 2. MIME 類型與惡意檔案驗證
            if (!ALLOWED_MIME_TYPES.has(file.type)) {
                return reject(new Error(`不支援的檔案格式: ${file.type || '未知'}。為確保系統安全，僅允許 PDF、圖片與試算表。`));
            }

            const fileRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(fileRef, file, {
                contentType: file.type,
                customMetadata: {
                    uploadedAt: new Date().toISOString(),
                    originalName: file.name,
                },
            });

            uploadTask.on(
                "state_changed",
                (snapshot: UploadTaskSnapshot) => {
                    if (onProgress) {
                        onProgress({
                            bytesTransferred: snapshot.bytesTransferred,
                            totalBytes: snapshot.totalBytes,
                            percentage: Math.round(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            ),
                            state: snapshot.state as UploadProgress["state"],
                        });
                    }
                },
                (error: StorageError) => {
                    console.error("Storage upload error:", error);
                    reject(new Error(`上傳失敗: ${error.message}`));
                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve({
                            downloadUrl,
                            path,
                            fileName: file.name,
                        });
                    } catch (err) {
                        reject(err);
                    }
                }
            );
        });
    },
};
