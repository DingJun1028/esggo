import { Request, Response } from 'express';
import * as agentService from '../services/agentService.js';
import { AgentSoulService } from '../services/AgentSoulService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAgentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const agent = await agentService.getAgentById(id);
  if (!agent) {
    return res.status(404).json({ success: false, error: 'Agent not found' });
  }
  return res.json({ success: true, data: agent });
});

export const getAgents = asyncHandler(async (req: Request, res: Response) => {
  const agents = await agentService.getAllAgents();
  return res.json({ success: true, data: agents });
});

export const createAgent = asyncHandler(async (req: Request, res: Response) => {
  const newAgent = await agentService.createAgent(req.body);
  return res.status(201).json({ success: true, data: newAgent });
});

export const calibrateAgent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AgentSoulService.calibrateSoul(id);
  return res.json({ success: true, data: result });
});

export const crystallizeAgent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AgentSoulService.crystallizeAgent(id);
  return res.json({ success: true, data: result });
});
