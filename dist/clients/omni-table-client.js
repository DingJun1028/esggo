"use strict";
// OmniTable API Client - ESG GO v9.0.0 (Extended)
// 实现 OmniTable API 客户端，支持所有主要功能
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniTableClient = void 0;
class OmniTableClient {
    constructor(apiToken, spaceId) {
        this.apiToken = apiToken;
        this.spaceId = spaceId;
        this.baseURL = 'https://vika.cn/fusion/v1';
    }
    // 通用请求方法
    async request(url, options) {
        const response = await fetch(url, options);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`API Error ${response.status}: ${result.message || JSON.stringify(result)}`);
        }
        return result.data;
    }
    // 获取记录
    async getRecords(datasheetId, params) {
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
    async createRecords(datasheetId, records, fieldKey = 'name') {
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
    async updateRecords(datasheetId, records, fieldKey = 'name') {
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
    async deleteRecords(datasheetId, recordIds) {
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
    async getFields(datasheetId, viewId) {
        const url = `${this.baseURL}/datasheets/${datasheetId}/fields`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
        const query = new URLSearchParams();
        if (viewId)
            query.set('viewId', viewId);
        const response = await fetch(`${url}?${query.toString()}`, { headers });
        return response.json();
    }
    // 创建字段
    async createField(datasheetId, field) {
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
    async deleteField(datasheetId, fieldId) {
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
    async getViews(datasheetId) {
        const url = `${this.baseURL}/datasheets/${datasheetId}/views`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const response = await fetch(url, { headers });
        return response.json();
    }
    // 创建表格
    async createDatasheet(datasheet) {
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
    async uploadAttachment(datasheetId, file) {
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
    async getNodes(spaceId) {
        const url = `${this.baseURL}/spaces/${spaceId || this.spaceId}/nodes`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const response = await fetch(url, { headers });
        return response.json();
    }
    // 搜索文件节点
    async searchNodes(type, permissions, query) {
        const url = `${this.baseURL}/fusion/v2/spaces/${this.spaceId}/nodes`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const searchParams = new URLSearchParams({ type });
        if (permissions)
            searchParams.append('permissions', permissions.join(','));
        if (query)
            searchParams.append('query', query);
        const response = await fetch(`${url}?${searchParams.toString()}`, { headers });
        return response.json();
    }
    // 获取文件节点详情
    async getNodeDetails(nodeId) {
        const url = `${this.baseURL}/spaces/${this.spaceId}/nodes/${nodeId}`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const response = await fetch(url, { headers });
        return response.json();
    }
    // 创建嵌入链接
    async createEmbedLink(nodeId, payload, theme = 'light') {
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
    async getEmbedLinks(nodeId) {
        const url = `${this.baseURL}/spaces/${this.spaceId}/nodes/${nodeId}/embedlinks`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const response = await fetch(url, { headers });
        return response.json();
    }
    // 删除嵌入链接
    async deleteEmbedLink(nodeId, linkId) {
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
    async getMember(unitId, sensitiveData) {
        const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/members/${unitId}`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const query = new URLSearchParams();
        if (sensitiveData)
            query.set('sensitiveData', 'true');
        const response = await fetch(`${url}?${query.toString()}`, { headers });
        return response.json();
    }
    // 更新成员
    async updateMember(unitId, updates, sensitiveData) {
        const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/members/${unitId}`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
        const query = new URLSearchParams();
        if (sensitiveData)
            query.set('sensitiveData', 'true');
        const body = JSON.stringify(updates);
        const response = await fetch(`${url}?${query.toString()}`, {
            method: 'PUT',
            headers,
            body,
        });
        return response.json();
    }
    // 删除成员
    async deleteMember(unitId) {
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
    async getTeamMembers(unitId, sensitiveData) {
        const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams/${unitId}/members`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const query = new URLSearchParams();
        if (sensitiveData)
            query.set('sensitiveData', 'true');
        const response = await fetch(`${url}?${query.toString()}`, { headers });
        return response.json();
    }
    // 获取子小组
    async getSubTeams(unitId) {
        const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/teams/${unitId}/children`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const response = await fetch(url, { headers });
        return response.json();
    }
    // 创建小组
    async createTeam(team) {
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
    async updateTeam(unitId, updates) {
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
    async deleteTeam(unitId) {
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
    async getRoleUnits(unitId, sensitiveData) {
        const url = `https://vika.cn/fusion/v1/spaces/${this.spaceId}/roles/${unitId}/units`;
        const headers = {
            'Authorization': `Bearer ${this.apiToken}`,
        };
        const query = new URLSearchParams();
        if (sensitiveData)
            query.set('sensitiveData', 'true');
        const response = await fetch(`${url}?${query.toString()}`, { headers });
        return response.json();
    }
    // 获取角色列表
    async getRoles(pageSize = 100, pageNum = 1) {
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
    async createRole(role) {
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
    async updateRole(unitId, updates) {
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
    async deleteRole(unitId) {
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
    async createChatCompletion(aiId, messages, options) {
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
exports.OmniTableClient = OmniTableClient;
//# sourceMappingURL=omni-table-client.js.map