import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogicNode, LogicNodeConfig } from './src/logics/LogicNode.js';
import { LogicRepo } from './src/storage/LogicRepo.js';
import { DocParser } from './src/parsers/DocParser.js';
import { authMiddleware } from './src/middleware/auth.js';
import { validateExportRequest } from './src/middleware/validator.js';
import { formatForSAP, exportToSAP, exportToAItable } from './src/adapters/sapAdapter.js';
import { watch } from 'fs';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Protected routes
app.use('/logic/*', authMiddleware);

// Initialize a Logic Node
app.post('/logic/initialize', async (req, res) => {
  const config: LogicNodeConfig = req.body;
  const stored = LogicRepo.findById(config.name);
  let node: unknown;
  if (stored) {
    const parsedConfig = JSON.parse(stored.config);
    node = createLogicNode({ ...config, ...parsedConfig });
    await node.initialize();
  } else {
    node = createLogicNode(config);
    await node.initialize();
    LogicRepo.save({
      name: config.name,
      config: JSON.stringify(node),
      compliance_score: node.config.compliance_score
    });
  }
  res.json({ 
    message: `Node ${config.name} ${stored ? 'loaded' : 'created'}`, 
    score: node.config.compliance_score 
  });
});

// Export a Logic Node to a target system
app.post('/logic/export', validateExportRequest, async (req, res) => {
  const { nodeName, targetSystem } = req.body;
  const node = LogicRepo.findById(nodeName);
  if (!node) return res.status(404).json({ error: 'Logic node not found' });
  try {
    const parsed = JSON.parse(node.config);
    if (targetSystem.toUpperCase() === "SAP") {
      const sapPayload = formatForSAP(parsed, targetSystem);
      const success = await exportToSAP(sapPayload);
      if (success) {
        LogicRepo.logAction('export', nodeName, 'Exported to SAP');
        res.json({ 
          success: true, 
          message: `Successfully exported ${nodeName} to SAP`, 
          payload: sapPayload 
        });
      }
    } else if (targetSystem.toUpperCase() === "OMNITABLE") {
      const success = await exportToAItable(parsed);
      if (success) {
        LogicRepo.logAction('export', nodeName, 'Synced to AItable');
        res.json({ 
          success: true, 
          message: `Successfully synced ${nodeName} to AItable` 
        });
      }
    } else {
      res.status(400).json({ error: "Unsupported system" });
    }
  } catch (err: unknown) {
    res.status(500).json({ error: err.message });
  }
});

// Process Markdown files
app.post('/logic/process-docs', async (req, res) => {
  try {
    await DocParser.processDocsFolder('C:\\Project\\esggo\\esggo\\docs');
    res.json({ success: true, message: 'All docs processed' });
  } catch (err: unknown) {
    res.status(500).json({ error: err.message });
  }
});

// List registered Logic Nodes
app.get('/logic/list', (req, res) => {
  const nodes = LogicRepo.listAll();
  res.json({ nodes });
});

const docsPath = 'C:\\Project\\esggo\\esggo\\docs';
watch(docsPath, { recursive: true }, async (event, filename) => {
  if (filename?.endsWith('.md')) {
    console.log(`🔔 ${filename} changed → re-processing`);
    await DocParser.processDocsFolder(docsPath);
  }
});

const PORT = process.env.PORT || 4000; // Changed to 4000
app.listen(PORT, () => console.log(`🚀 ESG GO Server running on http://localhost:${PORT}`));