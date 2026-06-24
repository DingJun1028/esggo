import fs from 'fs/promises';
import path from 'path';
import { createLogicNode, LogicNodeConfig } from '../logics/LogicNode.js';
import { LogicRepo } from '../storage/LogicRepo.js';

export class DocParser {
  static async parseMarkdownToLogic(filePath: string): Promise<LogicNodeConfig | null> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const fileName = path.basename(filePath, '.md');
      
      // Simple regex to find patterns like "Score: 0.8" or "Type: Carbon"
      const scoreMatch = content.match(/Score:\s*([0-9.]+)/i);
      const typeMatch = content.match(/Type:\s*([a-zA-Z_]+)/i);
      
      if (!typeMatch) return null; // If no type is found, we can't create a logic node

      return {
        name: fileName.replace(/[\s_-]/g, '_').toLowerCase(),
        version: '1.0.0',
        logic_type: typeMatch[1],
        compliance_score: scoreMatch ? parseFloat(scoreMatch[1]) : undefined
      };
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return null;
    }
  }

  static async processDocsFolder(docsPath: string) {
    const files = await fs.readdir(docsPath);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`🔍 Found ${mdFiles.length} markdown files. Starting extraction...`);
    
    for (const file of mdFiles) {
      const fullPath = path.join(docsPath, file);
      const config = await this.parseMarkdownToLogic(fullPath);
      
      if (config) {
        const node = createLogicNode(config);
        await node.initialize();
        
        LogicRepo.save({
          name: (node as any).config.name,
          config: JSON.stringify(node),
          compliance_score: (node as any).config.compliance_score
        });
        console.log(`✅ Registered: ${config.name} (Score: ${(node as any).config.compliance_score})`);
      } else {
        console.log(`⚠️ Skipped ${file}: No logic pattern found.`);
      }
    }
  }
}
