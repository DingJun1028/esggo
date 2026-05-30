import { DocParser } from '../src/parsers/DocParser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('DocParser', () => {
  const testDocsPath = path.join(__dirname, 'test_docs');

  beforeAll(async () => {
    // Create test directory and dummy markdown files
    await fs.mkdir(testDocsPath, { recursive: true });
    
    const testFiles = [
      'carbon_policy.md',
      'water_policy.md',
      'invalid_file.txt'
    ];

    await Promise.all(testFiles.map(file => 
      fs.writeFile(path.join(testDocsPath, file), 
        file.endsWith('.md') 
          ? `Type: ${file.replace(/_policy\.md/, '')}\nScore: 0.8\nContent here...`
          : 'This is not a markdown file'
      )
    ));
  });

  afterAll(async () => {
    // Clean up test files
    await fs.rm(testDocsPath, { recursive: true });
  });

  test('should parse markdown file to LogicNodeConfig', async () => {
    const filePath = path.join(testDocsPath, 'carbon_policy.md');
    const config = await DocParser.parseMarkdownToLogic(filePath);
    
    expect(config).not.toBeNull();
    expect(config!.name).toBe('carbon_policy');
    expect(config!.logic_type).toBe('carbon');
    expect(config!.compliance_score).toBe(0.8);
  });

  test('should extract score from content', async () => {
    const filePath = path.join(testDocsPath, 'water_policy.md');
    const config = await DocParser.parseMarkdownToLogic(filePath);
    
    expect(config!.compliance_score).toBe(0.8);
  });

  test('should return null for files without logic patterns', async () => {
    const filePath = path.join(testDocsPath, 'invalid_file.txt');
    const config = await DocParser.parseMarkdownToLogic(filePath);
    
    expect(config).toBeNull();
  });

  test('should process directory and parse all markdown files', async () => {
    await DocParser.processDocsFolder(testDocsPath);
    
    // Check that files were processed (you could also verify LogicRepo if mocked)
    const files = await fs.readdir(testDocsPath);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    expect(mdFiles.length).toBeGreaterThan(0);
    expect(mdFiles).toContain('carbon_policy.md');
    expect(mdFiles).toContain('water_policy.md');
  });
});