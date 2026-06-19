"use client";

import { useEffect, useState } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
// 請確認此路徑指向您前端的 Firebase Client 初始化檔案
import { app } from "@/lib/firebase";

export const useAuditTrailListener = (auditId: string | null) => {
    const [status, setStatus] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [documentHash, setDocumentHash] = useState<string | null>(null);

    useEffect(() => {
        // 如果還沒有拿到 Job ID，就不啟動監聽
        if (!auditId) return;

        const db = getFirestore(app);
        const docRef = doc(db, "audit_trails", auditId);

        // 建立即時監聽 (onSnapshot)
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setStatus(data.status);

                // 當背景 Worker 處理完畢，將狀態改為 SEALED 時觸發
                if (data.status === "SEALED") {
                    setDownloadUrl(data.downloadUrl);
                    setDocumentHash(data.documentHash);

                    // 使用 Sonner 彈出精美的 Toast 通知
                    toast.success("✅ 報告已成功歸檔存證！", {
                        description: `您的永續報告已通過 5T 協議加密，具備不可竄改性。Hash: ${data.documentHash ? data.documentHash.substring(0, 16) + '...' : 'Verified'}`,
                        action: {
                            label: "開啟報告",
                            onClick: () => window.open(data.downloadUrl, "_blank"),
                        },
                    });
                }
            }
        }, (error) => {
            console.error("監聽 Audit Trail 發生錯誤:", error);
        });

        // ⚠️ 非常重要：Component 卸載時必須清除監聽，避免 Memory Leak 與重複計費
        return () => unsubscribe();
    }, [auditId]);

    return { status, downloadUrl, documentHash };
};