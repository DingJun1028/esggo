import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { isPrivateIP, getSafeLookup } from '../utils/ssrfValidator.js';

export class MCPService {
  private turndownService: any;

  constructor() {
    this.turndownService = new TurndownService();
  }

  // 🛡️ SENTINEL: Validate URL to prevent SSRF
  validateUrl(inputUrl: string) {
    try {
      const url = new URL(inputUrl);

      // 1. Protocol Check (HTTP/HTTPS only)
      if (!['http:', 'https:'].includes(url.protocol)) return false;

      const hostname = url.hostname;

      // 2. IP Address Validation (Check string format first)
      if (isPrivateIP(hostname)) return false;

      // 3. Domain Validation
      // Block localhost domain explicitly
      if (hostname === 'localhost') return false;

      return true;
    } catch (e) {
      return false;
    }
  }

  // 1. Fetch Rune: HTML to Markdown
  async fetchAsMarkdown(url: string, selector?: string) {
    // 🛡️ SENTINEL: Security Check (Initial static check)
    if (!this.validateUrl(url)) {
      console.warn(`[Security] Blocked potential SSRF attempt: ${url}`);
      return { status: 'error', message: 'Restricted URL or invalid protocol.' };
    }

    try {
      // 🛡️ SENTINEL: Secure DNS Lookup to prevent DNS Rebinding
      const safeLookup = getSafeLookup();

      const agentOptions = { lookup: safeLookup };

      // Disable redirects to prevent bypass via 30x to localhost
      // Use custom agents with safe lookup
      const response = await axios.get(url, {
        maxRedirects: 0,
        httpAgent: new http.Agent(agentOptions),
        httpsAgent: new https.Agent(agentOptions),
      });

      const html = new JSDOM(response.data).window.document;
      const targetElement = selector ? html.querySelector(selector) || html.body : html.body;

      if (!targetElement) {
        return { status: 'error', message: 'Target element not found.' };
      }

      const markdown = this.turndownService.turndown(targetElement.outerHTML);
      return { status: 'success', data: markdown };
    } catch (error: any) {
      console.error(`Fetch error: ${error.message}`);
      return { status: 'error', message: `Failed to fetch from ${url}.` };
    }
  }

  // 2. Thinking Rune: Sequential Logic Simulation
  async solveProblem(problem: string, steps: string[] = []) {
    const result: Record<string, string> = {};
    // TODO: Integrate real AI Engine (e.g., Gemini/Straico)
    for (const step of steps) {
      result[step] = `[Thinking] Simulated analysis for: ${step}`;
    }
    return { status: 'success', data: result };
  }

  // 3. Manifest Rune: EdgeOne Pages Deployment Stub
  async deployContent(content: string, isMarkdown: boolean = false) {
    try {
      const id = uuidv4();
      const fileName = isMarkdown ? `md_${id}.html` : `${id}.html`;
      // Simulate deployment path in a 'deployments' folder relative to CWD
      const deployPath = path.join(process.cwd(), 'deployments', fileName);

      // Ensure directory exists
      await fs.mkdir(path.dirname(deployPath), { recursive: true });

      let contentToDeploy = content;
      if (isMarkdown) {
        contentToDeploy = `<!DOCTYPE html><html><body><article class="markdown-body">${this.turndownService.turndown(content)}</article></body></html>`;
      }

      await fs.writeFile(deployPath, contentToDeploy);
      const publicUrl = `https://edgeone.pages.dev/${id}`; // Simulated URL
      return { status: 'success', data: publicUrl };
    } catch (error: any) {
      console.error(`Deployment error: ${error.message}`);
      return { status: 'error', message: 'Failed to deploy content.' };
    }
  }

  // 4. Omniscience Rune: arXiv Search
  async searchArxiv(query: string, maxResults: number = 5) {
    try {
      const apiUrl = `http://export.arxiv.org/api/query?search_query=${query}&max_results=${maxResults}`;
      // In a real scenario, we would parse the XML response here.
      await axios.get(apiUrl);

      return {
        status: 'success',
        data: [{ title: 'Simulated Paper: JunAiKey Architecture', authors: ['Jun.Ai.Key'] }],
      };
    } catch (error) {
      return { status: 'error', message: 'Failed to search arXiv.' };
    }
  }

  // 5. Context Rune: Documentation Retrieval
  async getContext7Docs(library: string, version: string) {
    return {
      status: 'success',
      data: {
        library,
        documentation: 'Simulated Context7 documentation content.',
        codeExamples: [{ title: 'Example', code: 'console.log("Hello JunAiKey");' }],
      },
    };
  }
}
