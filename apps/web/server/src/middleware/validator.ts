import { Request, Response, NextFunction } from 'express';

export const validateExportRequest = (req: Request, res: Response, next: NextFunction) => {
  const { nodeName, targetSystem } = req.body;

  if (!nodeName || !targetSystem) {
    return res.status(400).json({ error: 'Both nodeName and targetSystem are required' });
  }

  // Basic validation for target system naming convention
  const allowedSystems = ['SAP', 'AWS', 'IBM', 'ORACLE'];
  if (!allowedSystems.includes(targetSystem.toUpperCase())) {
    return res.status(400).json({ error: `Unsupported target system. Allowed: ${allowedSystems.join(', ')}` });
  }

  next();
};