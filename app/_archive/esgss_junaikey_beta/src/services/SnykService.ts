/// <reference types="vite/client" />
import { omniLogger, LogCategory } from './omniLogger.js';

// Snyk API Configuration
const SNYK_API_BASE = 'https://api.snyk.io/rest';
const SNYK_API_VERSION = '2024-10-15';

interface SnykConfig {
  orgId: string;
  apiToken: string;
}

interface VulnerabilitySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface SecurityIssue {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  package: string;
  version: string;
  cve?: string;
  cvssScore?: number;
  exploitable: boolean;
  fixedIn?: string;
  description: string;
}

interface ScanResult {
  projectId: string;
  scanDate: number;
  summary: VulnerabilitySummary;
  issues: SecurityIssue[];
}

// Export types
export type { VulnerabilitySummary, SecurityIssue, ScanResult };

class SnykServiceClass {
  private config: SnykConfig = {
    orgId: '',
    apiToken: '',
  };

  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Read configuration from environment variables
    // Safe env access
    const safeEnv =
      typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env
        : (process.env as any);

    const orgId = safeEnv.VITE_SNYK_ORG_ID;
    const apiToken = safeEnv.VITE_SNYK_API_TOKEN;

    if (orgId && apiToken) {
      this.config.orgId = orgId;
      this.config.apiToken = apiToken;
      this.isConfigured = true;
      omniLogger.info(LogCategory.SECURITY, 'Snyk service configured');
    } else {
      omniLogger.warn(
        LogCategory.SECURITY,
        'Snyk credentials not configured, security scanning will be disabled'
      );
    }
  }

  /**
   * Manually configure Snyk credentials
   */
  public configure(orgId: string, apiToken: string) {
    this.config.orgId = orgId;
    this.config.apiToken = apiToken;
    this.isConfigured = true;
    omniLogger.info(LogCategory.SECURITY, 'Snyk credentials updated');
  }

  /**
   * Check if service is available
   */
  public isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Test API connection
   */
  public async testConnection(): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const response = await fetch(
        `${SNYK_API_BASE}/orgs/${this.config.orgId}?version=${SNYK_API_VERSION}`,
        {
          method: 'GET',
          headers: {
            Authorization: `token ${this.config.apiToken}`,
            'Content-Type': 'application/vnd.api+json',
          },
        }
      );

      if (response.ok) {
        omniLogger.info(LogCategory.SECURITY, 'Snyk API connection successful');
        return true;
      } else {
        omniLogger.error(LogCategory.SECURITY, `Snyk API connection failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Snyk API connection error', { error });
      return false;
    }
  }

  /**
   * List all projects in the organization
   */
  public async listProjects(): Promise<Array<{ id: string; name: string }>> {
    if (!this.isReady()) {
      return [];
    }

    try {
      const response = await fetch(
        `${SNYK_API_BASE}/orgs/${this.config.orgId}/projects?version=${SNYK_API_VERSION}`,
        {
          method: 'GET',
          headers: {
            Authorization: `token ${this.config.apiToken}`,
            'Content-Type': 'application/vnd.api+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      return (
        data.data?.map((project: any) => ({
          id: project.id,
          name: project.attributes?.name || 'Unnamed Project',
        })) || []
      );
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Failed to fetch project list', { error });
      return [];
    }
  }

  /**
   * Scan project for vulnerabilities
   */
  public async scanProject(projectId: string): Promise<ScanResult | null> {
    if (!this.isReady()) {
      omniLogger.warn(LogCategory.SECURITY, 'Snyk not configured, unable to scan');
      return null;
    }

    try {
      const response = await fetch(
        `${SNYK_API_BASE}/orgs/${this.config.orgId}/projects/${projectId}/issues?version=${SNYK_API_VERSION}`,
        {
          method: 'GET',
          headers: {
            Authorization: `token ${this.config.apiToken}`,
            'Content-Type': 'application/vnd.api+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.status}`);
      }

      const data = await response.json();

      // Parse vulnerability data
      const issues: SecurityIssue[] = (data.data || []).map((issue: any) => {
        const attrs = issue.attributes || {};
        return {
          id: issue.id,
          title: attrs.title || 'Unknown Issue',
          severity: attrs.severity?.toLowerCase() || 'low',
          package: attrs.package?.name || 'unknown',
          version: attrs.package?.version || 'N/A',
          cve: attrs.identifiers?.CVE?.[0],
          cvssScore: attrs.cvss_score,
          exploitable:
            attrs.exploit_maturity === 'proof-of-concept' || attrs.exploit_maturity === 'mature',
          fixedIn: attrs.fix_info?.nearest_fixed_in_version,
          description: attrs.description || '',
        };
      });

      // Summary statistics
      const summary: VulnerabilitySummary = {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
        total: issues.length,
      };

      omniLogger.info(
        LogCategory.SECURITY,
        `Scan complete: Found ${summary.total} vulnerabilities`,
        { summary }
      );

      return {
        projectId,
        scanDate: Date.now(),
        summary,
        issues,
      };
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Project scan failed', { error });
      return null;
    }
  }

  /**
   * Quick scan of current project (using first found project)
   */
  public async quickScan(): Promise<ScanResult | null> {
    const projects = await this.listProjects();

    if (projects.length === 0) {
      omniLogger.warn(LogCategory.SECURITY, 'No scannable projects found');
      return null;
    }

    omniLogger.info(LogCategory.SECURITY, `Starting scan for project: ${projects[0]!.name}`);
    return await this.scanProject(projects[0]!.id);
  }

  /**
   * Ignore specific vulnerability
   */
  public async ignoreIssue(
    projectId: string,
    issueId: string,
    reason: string = 'Not applicable'
  ): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const response = await fetch(
        `${SNYK_API_BASE}/orgs/${this.config.orgId}/projects/${projectId}/ignores?version=${SNYK_API_VERSION}`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${this.config.apiToken}`,
            'Content-Type': 'application/vnd.api+json',
          },
          body: JSON.stringify({
            data: {
              type: 'ignore',
              attributes: {
                issue_id: issueId,
                reason,
                expires_at: null, // Ignore permanently
              },
            },
          }),
        }
      );

      if (response.ok) {
        omniLogger.info(LogCategory.SECURITY, `Ignored vulnerability: ${issueId}`);
        return true;
      }

      return false;
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Failed to ignore vulnerability', { error });
      return false;
    }
  }
}

// Singleton export
export const SnykService = new SnykServiceClass();
