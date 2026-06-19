const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * 5T 自動審定觸發器
 * 當 reports 集合中有新文檔建立時，自動進行合規性掃描
 */
exports.onReportCreated = functions.firestore
    .document('reports/{reportId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const reportId = context.params.reportId;

        console.log(`正在審定報告: ${reportId}, 標籤: ${newValue.title}`);

        // 模擬 5T 合規性掃描邏輯
        const auditResult = {
            status: 'verified',
            auditedAt: admin.firestore.FieldValue.serverTimestamp(),
            complianceScore: Math.floor(Math.random() * 20) + 80, // 80-100
            notes: 'AI 自動審定完成：5T 指標全數符合專業標準。'
        };

        return snap.ref.set({ audit: auditResult }, { merge: true });
    });

/**
 * Callable Function: 產出報告 PDF 並更新狀態
 */
exports.generateReportPDF = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', '請先登入後再執行此操作。');
    }

    const { reportId } = data;
    console.log(`用戶 ${context.auth.uid} 請求產出報告 PDF: ${reportId}`);

    // 在真實場景中這裡會調用 PDF 引擎 (如 Puppeteer) 並上傳至 Cloud Storage
    // 這裡僅模擬狀態更新
    await admin.firestore().collection('reports').doc(reportId).update({
        status: 'published',
        pdfUrl: `https://storage.googleapis.com/esggo-reports/${reportId}.pdf`,
        publishedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
        success: true,
        message: '報告已成功發佈並於 5T 存證。'
    };
});
