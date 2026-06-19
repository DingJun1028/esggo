import express, { Request, Response } from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication
router.use(authenticateToken);

/**
 * POST /api/l1-assessment
 * Save a new L1 Health Check assessment.
 */
router.post('/', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const {
            companyName, industry, employeeCount,
            hasGhInventory, hasCodeOfConduct, hasSustainabilityReport, supplyChainPolicy,
            contactPerson, email,
            score, overallStatus
        } = req.body;

        // Basic validation
        if (!companyName || !score) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const queryText = `
      INSERT INTO l1_assessments (
        user_id, company_name, industry, employee_count,
        has_gh_inventory, has_code_of_conduct, has_sustainability_report, supply_chain_policy,
        score, overall_status,
        contact_person, contact_email
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10,
        $11, $12
      ) RETURNING id, created_at
    `;

        const values = [
            (req as any).user.id, companyName, industry, employeeCount,
            hasGhInventory, hasCodeOfConduct, hasSustainabilityReport, supplyChainPolicy,
            score, overallStatus,
            contactPerson, email
        ];

        const result = await client.query(queryText, values);
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error saving L1 assessment:', error);
        res.status(500).json({ error: 'Failed to save assessment' });
    } finally {
        client.release();
    }
});

/**
 * GET /api/l1-assessment/mine/latest
 * Get the latest assessment for the current user.
 */
router.get('/mine/latest', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const result = await pool.query(
            'SELECT * FROM l1_assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No assessment found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching L1 assessment:', error);
        res.status(500).json({ error: 'Failed to fetch assessment' });
    }
});

export default router;
