import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import * as admin from "firebase-admin";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import crypto from "crypto";

// 強制使用 Node.js Runtime (因為需要處理 Stream 與 Firebase Admin)
export const runtime = "nodejs";

// 延長 Vercel 伺服器函數的執行時間限制
export const maxDuration = 60;

// 1. 初始化 Firebase Admin
if (process.env.FIREBASE_PROJECT_ID && !admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID as string,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") as string,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
    });
}

// 2. 註冊伺服器端字型
Font.register({
    family: "NotoSansTC",
    src: "https://fonts.gstatic.com/s/notosanstc/v35/XRFP3I6Li01BKofIMN5hRjBQUzh2v1TBaDk.ttf",
});

const styles = StyleSheet.create({
    page: { padding: 60, fontFamily: "NotoSansTC", backgroundColor: "#FFFFFF" },
    mainTitle: { fontSize: 24, fontWeight: "bold", color: "#0F172A", marginBottom: 20 },
    text: { fontSize: 12, color: "#334155", marginBottom: 10 },
});

// 3. 伺服器端的 PDF 模板
const ServerEsgDocument = ({ title, metrics }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.mainTitle}>{title} - 歸檔存證版</Text>
            <Text style={styles.text}>範疇一排放量: {metrics.scope1Emissions} tCO2e</Text>
            <Text style={styles.text}>範疇二排放量: {metrics.scope2Emissions} tCO2e</Text>
            <Text style={styles.text}>歸檔時間: {new Date().toISOString()}</Text>
        </Page>
    </Document>
);

export async function POST(request: Request) {
    try {
        const { title, metrics } = await request.json();

        if (!title || !metrics) {
            return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
        }

        const pdfStream = await renderToStream(<ServerEsgDocument title={title} metrics={metrics} />);
        const chunks: Buffer[] = [];
        for await (const chunk of pdfStream as any) {
            chunks.push(Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);
        const documentHash = crypto.createHash("sha256").update(pdfBuffer).digest("hex");

        const bucket = admin.storage().bucket();
        const fileName = `esg-reports/Archive_${Date.now()}.pdf`;
        const file = bucket.file(fileName);

        await file.save(pdfBuffer, {
            contentType: "application/pdf",
            metadata: {
                metadata: {
                    generatedBy: "Omni Engine",
                    auditStatus: "Sealed",
                    documentHash: documentHash
                },
            },
        });

        const [downloadUrl] = await file.getSignedUrl({
            action: "read",
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        const db = admin.firestore();
        const auditTrailRef = await db.collection("audit_trails").add({
            action: "REPORT_ARCHIVED",
            fileName: fileName,
            title: title,
            generatedBy: "Omni Engine",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            downloadUrl: downloadUrl,
            status: "SEALED",
            metricsSnapshot: metrics,
            documentHash: documentHash
        });

        return NextResponse.json({
            success: true,
            url: downloadUrl,
            path: fileName,
            auditId: auditTrailRef.id,
            documentHash: documentHash
        });
    } catch (error) {
        console.error("PDF 歸檔失敗:", error);
        return NextResponse.json({ error: "伺服器內部錯誤" }, { status: 500 });
    }
}
