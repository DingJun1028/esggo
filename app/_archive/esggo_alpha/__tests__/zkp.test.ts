import { TrustEngine } from "../lib/core";

describe("TrustEngine ZKP Simulation", () => {
    const sampleData = {
        revenue: 5000000,
        carbonFootprint: 120.5,
        location: "Taipei",
        secretKey: "ESG-PRIVATE-123"
    };

    test("generateZKP should mask specified fields and provide salt", () => {
        const hiddenFields = ["secretKey", "revenue"];
        const { proofContext, maskedData } = TrustEngine.generateZKP(sampleData, hiddenFields);

        expect(maskedData.secretKey).toBe("[PROTECTED_BY_ZKP]");
        expect(maskedData.revenue).toBe("[PROTECTED_BY_ZKP]");
        expect(maskedData.carbonFootprint).toBe(120.5);

        expect(proofContext.salt).toBeDefined();
        expect(proofContext.hiddenFieldsMask).toContain("secretKey");
        expect(proofContext.algorithm).toContain("zk-SNARK");
        expect(proofContext.proof.a).toHaveLength(2);
    });

    test("forge should create a valid protocol with ZKP context", () => {
        const protocol = TrustEngine.forge(sampleData, ["secretKey"]);

        expect(protocol.trustworthy).toBe(true);
        expect(protocol.hash_lock).toBeDefined();
        expect(protocol.zkp_context).toBeDefined();
        expect(protocol.zkp_context?.salt).toBeDefined();
    });

    test("verify should return true for original data", () => {
        const protocol = TrustEngine.forge(sampleData, ["secretKey"]);
        const isValid = TrustEngine.verify(sampleData, protocol);
        expect(isValid).toBe(true);
    });

    test("verify should return false for tampered data", () => {
        const protocol = TrustEngine.forge(sampleData, ["secretKey"]);
        const tamperedData = { ...sampleData, revenue: 9999999 };
        const isValid = TrustEngine.verify(tamperedData, protocol);
        expect(isValid).toBe(false);
    });

    test("verifyZKP should validate the simulated proof structure", () => {
        const { proofContext } = TrustEngine.generateZKP(sampleData, ["secretKey"]);
        const isZKPValid = TrustEngine.verifyZKP(proofContext);
        expect(isZKPValid).toBe(true);
    });

    test("verifyZKP should fail for invalid context", () => {
        // @ts-ignore
        const invalidContext = { algorithm: "none" };
        // @ts-ignore
        const isZKPValid = TrustEngine.verifyZKP(invalidContext);
        expect(isZKPValid).toBe(false);
    });
});
