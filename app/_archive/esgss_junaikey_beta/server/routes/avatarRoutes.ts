
import express from 'express';
import { avatarOrchestrator } from '../services/OmniAvatarOrchestrator.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

const router = express.Router();

// Get current state
router.get('/state', (req, res) => {
    res.json({
        success: true,
        data: avatarOrchestrator.getCurrentState()
    });
});

// Switch Persona
router.post('/switch', (req, res) => {
    const { personaId } = req.body;
    if (!personaId) {
        return res.status(400).json({ success: false, error: 'personaId is required' });
    }

    const success = avatarOrchestrator.switchPersona(personaId);
    if (success) {
        res.json({ success: true, data: avatarOrchestrator.getCurrentState() });
    } else {
        res.status(404).json({ success: false, error: 'Persona not found' });
    }
});

// Chat with Avatar
router.post('/chat', async (req, res) => {
    const { message, context } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, error: 'message is required' });
    }

    try {
        const response = await avatarOrchestrator.generateResponse(message, context);
        res.json({
            success: true,
            data: {
                response,
                state: avatarOrchestrator.getCurrentState()
            }
        });
    } catch (error: any) {
        omniLogger.error(LogCategory.AI, 'Avatar chat failed', { error: error.message });
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

export default router;
