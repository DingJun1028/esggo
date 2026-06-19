import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { INcbReport } from "@/lib/types/ncb-types";

/**
 * PDF Generator Utility for Omni ESG Platform
 * Optimized for High-Fidelity Professional Reports
 */
export async function generateProfessionalPDF(
    elementId: string,
    reportData: Partial<INcbReport>,
    fileName: string = "Omni_ESG_Report.pdf"
): Promise<boolean> {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Print element not found:", elementId);
        return false;
    }

    try {
        // High-fidelity capture settings
        const canvas = await html2canvas(element, {
            scale: 2, // 提升解析度
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 1024, // 固定寬度以確保排版一致
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // 計算 A4 比例下的高度
        const imgHeight = (canvasHeight * pageWidth) / canvasWidth;
        let heightLeft = imgHeight;
        let position = 0;

        // 嵌入 5T Protocol 隱性元數據
        pdf.setProperties({
            title: reportData.title || "Omni ESG Report",
            subject: "Sustainability Disclosure",
            author: "Omni 萬能智庫 Agentic Network",
            keywords: `ESG, 5T_Protocol, ${reportData.id}`,
            creator: "Omni 5T_Seal_Authority"
        });

        // 第一頁
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;

        // 多頁處理
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // 保存文件
        pdf.save(fileName);
        return true;
    } catch (error) {
        console.error("PDF generation failed:", error);
        return false;
    }
}
