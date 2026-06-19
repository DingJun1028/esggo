import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { MOCK_SUPPLIERS } from "@/lib/data/mock-suppliers";
// import knowledge base mock if it's exported. Let's start with MOCK_SUPPLIERS.

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");

        // Temporary secret for the seeding script
        if (secret !== "secretrun") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const companyId = "demo-company";
        const suppliersRef = collection(db, "companies", companyId, "suppliers");

        let count = 0;
        for (const supplier of MOCK_SUPPLIERS) {
            // Using supplier.id as document ID
            await setDoc(doc(suppliersRef, supplier.id), supplier);
            count++;
        }

        return NextResponse.json({ success: true, seeded: count, target: "suppliers" });
    } catch (error: any) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
