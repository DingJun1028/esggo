// server/routes/taskRoutes.js

import express from 'express';
import * as taskService from '../services/taskService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes in this file
router.use(authenticateToken);

/**
 * GET /api/tasks
 * Retrieves all available tasks.
 */
router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/:taskId
 * Retrieves a specific task.
 */
router.get('/:taskId', async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const task = await taskService.getTask(parseInt(taskId, 10));
    res.json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tasks/:taskId/complete
 * Completes a task for a user and awards rewards.
 */
router.post('/:taskId/complete', async (req, res, next) => {
  const { taskId } = req.params;
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = req.user.userId; // Assuming user ID is available from the auth middleware
  try {
    const updatedProfile = await taskService.completeTask(userId, parseInt(taskId, 10));
    res.json({ message: 'Task completed successfully!', profile: updatedProfile });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/user
 * Retrieves all tasks assigned to a specific user.
 */
router.get('/user', async (req, res, next) => {
  const userId = req.user.userId; // Assuming user ID is available from the auth middleware
  try {
    const tasks = await taskService.getUserTasks(userId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

export default router;
