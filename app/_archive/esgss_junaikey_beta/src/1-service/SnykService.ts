/// <reference types="vite/client" />
import { omniLogger, LogCategory } from './omniLogger';

// Snyk API 配置
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
    // 從環境變數讀取配置
    const orgId = import.meta.env.VITE_SNYK_ORG_ID;
    const apiToken = import.meta.env.VITE_SNYK_API_TOKEN;

    if (orgId && apiToken) {
      this.config.orgId = orgId;
      this.config.apiToken = apiToken;
      this.isConfigured = true;
      omniLogger.info(LogCategory.SECURITY, 'Snyk 服務已配置');
    } else {
      omniLogger.warn(LogCategory.SECURITY, 'Snyk 憑證未配置，安全掃描將被禁用');
    }
  }

  /**
   * 手動配置 Snyk 憑證
   */
  public configure(orgId: string, apiToken: string) {
    this.config.orgId = orgId;
    this.config.apiToken = apiToken;
    this.isConfigured = true;
    omniLogger.info(LogCategory.SECURITY, 'Snyk 憑證已更新');
  }

  /**
   * 檢查服務是否可用
   */
  public isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * 測試 API 連接
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
        omniLogger.info(LogCategory.SECURITY, 'Snyk API 連接成功');
        return true;
      } else {
        omniLogger.error(LogCategory.SECURITY, `Snyk API 連接失敗：${response.status}`);
        return false;
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Snyk API 連接錯誤', { error });
      return false;
    }
  }

  /**
   * 獲取組織的所有專案
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
        throw new Error(`API 錯誤：${response.status}`);
      }

      const data = await response.json();

      return (
        data.data?.map((project: any) => ({
          id: project.id,
          name: project.attributes?.name || 'Unnamed Project',
        })) || []
      );
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, '獲取專案列表失敗', { error });
      return [];
    }
  }

  /**
   * 掃描專案漏洞
   */
  public async scanProject(projectId: string): Promise<ScanResult | null> {
    if (!this.isReady()) {
      omniLogger.warn(LogCategory.SECURITY, 'Snyk 未配置，無法掃描');
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
        throw new Error(`掃描失敗：${response.status}`);
      }

      const data = await response.json();

      // 解析漏洞數據
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

      // 統計摘要
      const summary: VulnerabilitySummary = {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
        total: issues.length,
      };

      omniLogger.info(LogCategory.SECURITY, `掃描完成：發現 ${summary.total} 個漏洞`, { summary });

      return {
        projectId,
        scanDate: Date.now(),
        summary,
        issues,
      };
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, '專案掃描失敗', { error });
      return null;
    }
  }

  /**
   * 快速掃描當前專案（使用第一個專案）
   */
  public async quickScan(): Promise<ScanResult | null> {
    const projects = await this.listProjects();

    if (projects.length === 0) {
      omniLogger.warn(LogCategory.SECURITY, '沒有找到可掃描的專案');
      return null;
    }

    omniLogger.info(LogCategory.SECURITY, `開始掃描專案：${projects[0]!.name}`);
    return await this.scanProject(projects[0]!.id);
  }

  /**
   * 忽略特定漏洞
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
                expires_at: null, // 永久忽略
              },
            },
          }),
        }
      );

      if (response.ok) {
        omniLogger.info(LogCategory.SECURITY, `已忽略漏洞：${issueId}`);
        return true;
      }

      return false;
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, '忽略漏洞失敗', { error });
      return false;
    }
  }
}

// 單例導出
export const SnykService = new SnykServiceClass();

// 導出類型
export type { VulnerabilitySummary, SecurityIssue, ScanResult };
