const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// 🏛️ OmniCore Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// 💎 Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 👁️ /api/see: All-Seeing Eye (Vision)
 * Analysing images and converting to 5T-compliant metadata.
 */
app.post('/api/see', async (req, res) => {
    try {
        const { image, mimeType, prompt } = req.body;
        if (!image) return res.status(400).json({ error: "Missing image data" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
            prompt || "Describe this image for ESG knowledge base. Focus on tangible assets, environmental impact, or social governance signals.",
            {
                inlineData: {
                    data: image,
                    mimeType: mimeType || "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            analysis: text,
            metadata: {
                timestamp: Date.now(),
                model: "gemini-1.5-flash",
                status: "Seen"
            }
        });
    } catch (error) {
        console.error("Vision Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * 🧠 /api/learn: Knowledge Ingestion (Boost.space/Webhook)
 */
app.post('/api/learn', async (req, res) => {
    const { source, payload, secret } = req.body;

    // Simple Secret Check
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(`[OmniLearn] Ingesting from ${source || 'Unknown'}`);

    // Logic for entropy reduction and 5T validation would go here
    res.json({
        success: true,
        message: "Data queued for resonance",
        atom_id: `ATOM-${Date.now()}`
    });
});

app.listen(port, () => {
    console.log(`🏛️ Celestial Server is awake at http://localhost:${port}`);
});
