import { app } from "@/lib/firebase";
import { getAI, getGenerativeModel } from "@firebase/ai";

// Initialize Vertex AI from Firebase (Tier 1)
export const vertexAI = typeof window !== "undefined" ? getAI(app) : null;

export const getCloudModel = (modelName: string = "gemini-1.5-pro") => {
    if (!vertexAI) throw new Error("Vertex AI not initialized");
    // Return the generative model instance
    return getGenerativeModel(vertexAI, { model: modelName });
};

export const generateFromCloud = async (prompt: string, modelName: string = "gemini-1.5-pro") => {
    const model = getCloudModel(modelName);
    const result = await model.generateContent(prompt);
    return result.response.text();
};

export const generateStreamFromCloud = async (prompt: string, modelName: string = "gemini-1.5-pro") => {
    const model = getCloudModel(modelName);
    return await model.generateContentStream(prompt);
};
