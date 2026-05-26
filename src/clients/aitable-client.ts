// AITable API Client - ESG GO v9.0.0 (Extended)
// 实现 AITable API 客户端，支持所有主要功能

export class AITableClient {
  private baseURL: string;
  private apiToken: string;
  private spaceId: string;

  constructor(apiToken: string, spaceId: string) {
    this.apiToken = apiToken;
    this.spaceId = spaceId;
    this.baseURL = 'https://vika.cn/fusion/v1';
  }

  // 通用请求方法
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${result.message || JSON.stringify(result)}`);
    }
    return result.data;
  }

  // 获取记录
  async getRecords(datasheetId: string, params?: {
    pageSize?: number;
    pageNum?: number;
    viewId?: string;
    fields?: string[];
    filterByFormula?: string;
    cellFormat?: 'json' | 'string';
    fieldKey?: 'name' | 'id';
  }): Promise<{
    pageNum: number;
    records: any[];
    pageSize: number;
    total: number;
  }> {
    const url = `${this.baseURL}/datasheets/${datasheetId}/records`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, Array.isArray(value) ? value.join(',') : String(value));
        }
      });
    }
    const response = await fetch(url + (query.toString() ? '?' + query.toString() : ''), {
      headers,
    });
    return response.json();
  }

  // 创建记录
  async createRecords(datasheetId: string, records: any[], fieldKey: 'name' | 'id' = 'name') {
    const url = `${this.baseURL}/datasheets/${datasheetId}/records`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      records,
      fieldKey
    });
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }

  // 更新记录
  async updateRecords(datasheetId: string, records: any[], fieldKey: 'name' | 'id' = 'name') {
    const url = `${this.baseURL}/datasheets/${datasheetId}/records`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      records,
      fieldKey
    });
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body,
    });
    return response.json();
  }

  // 删除记录
  async deleteRecords(datasheetId: string, recordIds: string[]) {
    const url = `${this.baseURL}/datasheets/${datasheetId}/records`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const query = new URLSearchParams();
    query.append('recordIds', recordIds.join(','));
    const response = await fetch(`${url}?${query.toString()}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // 获取字段
  async getFields(datasheetId: string, viewId?: string) {
    const url = `${this.baseURL}/datasheets/${datasheetId}/fields`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const query = new URLSearchParams();
    if (viewId) query.set('viewId', viewId);
    const response = await fetch(`${url}?${query.toString()}`, { headers });
    return response.json();
  }

  // 创建字段
  async createField(datasheetId: string, field: any) {
    const url = `${this.baseURL}/spaces/${this.spaceId}/datasheets/${datasheetId}/fields`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(field);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }

  // 删除字段
  async deleteField(datasheetId: string, fieldId: string) {
    const url = `${this.baseURL}/spaces/${this.spaceId}/datasheets/${datasheetId}/fields/${fieldId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // 获取视图
  async getViews(datasheetId: string) {
    const url = `${this.baseURL}/datasheets/${datasheetId}/views`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, { headers });
    return response.json();
  }

  // 创建表格
  async createDatasheet(datasheet: {
    name: string;
    description?: string;
    folderId?: string;
    preNodeId?: string;
    fields?: any[];
  }) {
    const url = `${this.baseURL}/spaces/${this.spaceId}/datasheets`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(datasheet);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }

  // 上传附件
  async uploadAttachment(datasheetId: string, file: File) {
    const url = `${this.baseURL}/datasheets/${datasheetId}/attachments`;
    const formData = new FormData();
    formData.append('file', file);
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  }

  // 获取空间站列表
  async getSpaces() {
    const url = `${this.baseURL}/spaces`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, { headers });
    return response.json();
  }

  // 获取文件节点列表
  async getNodes(spaceId?: string) {
    const url = `${this.baseURL}/spaces/${spaceId || this.spaceId}/nodes`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, { headers });
    return response.json();
  }

  // 搜索文件节点
  async searchNodes(type: 'Folder' | 'Datasheet' | 'Form' | 'Dashboard' | 'Mirror', permissions?: number[], query?: string) {
    const url = `${this.baseURL}/fusion/v2/spaces/${this.spaceId}/nodes`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const searchParams = new URLSearchParams({ type });
    if (permissions) searchParams.append('permissions', permissions.join(','));
    if (query) searchParams.append('query', query);
    const response = await fetch(`${url}?${searchParams.toString()}`, { headers });
    return response.json();
  }

  // 获取文件节点详情
  async getNodeDetails(nodeId: string) {
    const url = `${this.baseURL}/spaces/${this.spaceId}/nodes/${nodeId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, { headers });
    return response.json();
  }

  // 创建嵌入链接
  async createEmbedLink(nodeId: string, payload: any, theme: 'light' | 'dark' = 'light') {
    const url = `${this.baseURL}/spaces/${this.spaceId}/nodes/${nodeId}/embedlinks`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({ payload, theme });
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }

  // 获取嵌入链接列表
  async getEmbedLinks(nodeId: string) {
    const url = `${this.baseURL}/spaces/${this.spaceId}/nodes/${nodeId}/embedlinks`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, { headers });
    return response.json();
  }

  // 删除嵌入链接
  async deleteEmbedLink(nodeId: string, linkId: string) {
    const url = `${this.baseURL}/spaces/${this.spaceId}/nodes/${nodeId}/embedlinks/${linkId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // 获取成员
  async getMember(unitId: string, sensitiveData?: boolean) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/members/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const query = new URLSearchParams();
    if (sensitiveData) query.set('sensitiveData', 'true');
    const response = await fetch(`${url}?${query.toString()}`, { headers });
    return response.json();
  }

  // 更新成员
  async updateMember(unitId: string, updates: { name?: string; teams?: string[]; roles?: string[] }, sensitiveData?: boolean) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/members/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const query = new URLSearchParams();
    if (sensitiveData) query.set('sensitiveData', 'true');
    const body = JSON.stringify(updates);
    const response = await fetch(`${url}?${query.toString()}`, {
      method: 'PUT',
      headers,
      body,
    });
    return response.json();
  }

  // 删除成员
  async deleteMember(unitId: string) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/members/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // 获取小组成员
  async getTeamMembers(unitId: string, sensitiveData?: boolean) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams/${unitId}/members`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const query = new URLSearchParams();
    if (sensitiveData) query.set('sensitiveData', 'true');
    const response = await fetch(`${url}?${query.toString()}`, { headers });
    return response.json();
  }

  // 获取子小组
  async getSubTeams(unitId: string) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams/${unitId}/children`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, { headers });
    return response.json();
  }

  // 创建小组
  async createTeam(team: { name: string; sequence?: number; parentUnitId?: string; roles?: string[] }) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(team);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }

  // 更新小组
  async updateTeam(unitId: string, updates: { name?: string; sequence?: number; parentUnitId?: string; roles?: string[] }) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(updates);
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
    });
    return response.json();
  }

  // 删除小组
  async deleteTeam(unitId: string) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // 获取角色成员和小组
  async getRoleUnits(unitId: string, sensitiveData?: boolean) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/roles/${unitId}/units`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const query = new URLSearchParams();
    if (sensitiveData) query.set('sensitiveData', 'true');
    const response = await fetch(`${url}?${query.toString()}`, { headers });
    return response.json();
  }

  // 获取角色列表
  async getRoles(pageSize: number = 100, pageNum: number = 1) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/roles`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const query = new URLSearchParams({
      pageSize: pageSize.toString(),
      pageNum: pageNum.toString(),
    });
    const response = await fetch(`${url}?${query.toString()}`, { headers });
    return response.json();
  }

  // 创建角色
  async createRole(role: { name: string; sequence?: number }) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/roles`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(role);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }

  // 更新角色
  async updateRole(unitId: string, updates: { name?: string; sequence?: number }) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/roles/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(updates);
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
    });
    return response.json();
  }

  // 删除角色
  async deleteRole(unitId: string) {
    const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/roles/${unitId}`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
    };
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // 创建聊天补全
  async createChatCompletion(aiId: string, messages: any[], options?: {
    model?: string;
    functions?: any[];
    functionCall?: { name: string };
    temperature?: number;
    topP?: number;
    stream?: boolean;
    stop?: string | string[];
    maxTokens?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    user?: string;
  }) {
    const url = `https://vika.cn/fusion/v1/ai/${aiId}/chat/completions`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      model: options?.model || 'gpt-3.5-turbo',
      messages,
      functions: options?.functions,
      function_call: options?.functionCall,
      temperature: options?.temperature,
      top_p: options?.topP,
      stream: options?.stream,
      stop: options?.stop,
      max_tokens: options?.maxTokens,
      presence_penalty: options?.presencePenalty,
      frequency_penalty: options?.frequencyPenalty,
      user: options?.user,
    });
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    return response.json();
  }
}