
import { jsPDF } from 'jspdf';

try {
    const doc = new jsPDF();
    doc.text("Hello world", 10, 10);
    const buffer = doc.output('arraybuffer');
    console.log("Success: jspdf generated " + buffer.byteLength + " bytes");
} catch (e) {
    console.error("Error using jspdf:", e.message);
}
