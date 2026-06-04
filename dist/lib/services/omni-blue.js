/**
 * OmniBlue | Blue.cc GraphQL Integration Client
 *
 * 串接 Blue.cc NoCMS 後端，透過 GraphQL API 讀取 / 寫入
 * Organization、Workspace（Project）、Record（Todo）等資料。
 *
 * 認證方式：Personal Access Token (PAT)
 *   - Token ID (cuid) → X-Bloo-Token-ID
 *   - Token Secret (pat_*) → X-Bloo-Token-Secret
 *   - Company ID (slug) → X-Bloo-Company-ID
 *   - Project ID (slug) → X-Bloo-Project-ID
 *
 * 參考文件：https://blue.app/api/start-guide/introduction
 *
 * 注意：Blue.cc 的實際 GraphQL schema 與官方文件有些許差異，
 *      本檔案已根據實際 introspection 結果調整。
 */
const BLUE_CC_GRAPHQL = 'https://api.blue.cc/graphql';
export class BlueCcClient {
    constructor(config) {
        this.tokenId = config?.tokenId || process.env.BLUE_CC_TOKEN_ID || '';
        this.tokenSecret = config?.tokenSecret || process.env.BLUE_CC_API_KEY || '';
        this.companyId = config?.companyId || process.env.BLUE_CC_COMPANY_ID || '';
        this.projectId = config?.projectId || process.env.BLUE_CC_PROJECT_ID;
        this.baseUrl = config?.baseUrl || BLUE_CC_GRAPHQL;
    }
    async request(query, variables) {
        if (!this.tokenId || !this.tokenSecret) {
            return { success: false, error: 'Blue.cc auth incomplete: BLUE_CC_TOKEN_ID / BLUE_CC_API_KEY required' };
        }
        const headers = {
            'Content-Type': 'application/json',
            'X-Bloo-Token-ID': this.tokenId,
            'X-Bloo-Token-Secret': this.tokenSecret,
            'X-Bloo-Company-ID': this.companyId,
        };
        if (this.projectId) {
            headers['X-Bloo-Project-ID'] = this.projectId;
        }
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({ query, variables }),
            });
            if (!res.ok) {
                const text = await res.text();
                return { success: false, error: `HTTP ${res.status}: ${text}` };
            }
            const json = await res.json();
            if (json.errors) {
                const msgs = json.errors.map((e) => e.message).join('; ');
                return { success: false, error: `GraphQL Error: ${msgs}` };
            }
            return { success: true, data: json.data };
        }
        catch (err) {
            return { success: false, error: `Request Failed: ${err.message}` };
        }
    }
    // ── Organization ──────────────────────────────────────────────────────────
    async getCurrentUser() {
        return this.request(`query { currentUser { id email fullName companies { id name slug } } }`);
    }
    async getOrganization() {
        return this.request(`query { company { id name slug } }`);
    }
    // ── Workspaces (Projects) ────────────────────────────────────────────────
    async listProjects() {
        const query = `
      query ProjectList($companyId: String!) {
        projectList(filter: { companyIds: [$companyId] }) {
          items { id name slug updatedAt createdAt }
          pageInfo { totalItems hasNextPage }
        }
      }
    `;
        const result = await this.request(query, { companyId: this.companyId });
        if (result.success && result.data?.projectList) {
            return {
                success: true,
                data: {
                    items: result.data.projectList.items,
                    totalItems: result.data.projectList.pageInfo?.totalItems || 0,
                },
            };
        }
        return result;
    }
    async getProject(projectId) {
        return this.request(`query GetProject($id: String!) { project(id: $id) { id name slug updatedAt createdAt } }`, { id: projectId });
    }
    // ── Todo Lists ───────────────────────────────────────────────────────────
    async listTodoLists(projectId) {
        const pid = projectId || this.projectId;
        if (!pid)
            return { success: false, error: 'projectId is required' };
        const query = `
      query TodoLists($projectId: String!) {
        todoLists(projectId: $projectId) {
          id
          title
          todosCount
          completed
          position
        }
      }
    `;
        const result = await this.request(query, { projectId: pid });
        if (result.success && result.data?.todoLists) {
            return { success: true, data: result.data.todoLists };
        }
        return result;
    }
    async getTodoListWithTodos(listId, limit = 50) {
        const query = `
      query TodoListWithTodos($id: String!) {
        todoList(id: $id) {
          id
          title
          todosCount
          completed
          todos {
            id
            uid
            title
            text
            done
            archived
            color
            duedAt
            startedAt
            completedAt
            createdAt
            updatedAt
            commentCount
            checklistCount
            checklistCompletedCount
            todoCustomFields {
              id
              value
              customField {
                id
                name
                type
              }
            }
            users {
              id
              email
              fullName
            }
            tags {
              id
              name
              color
            }
          }
        }
      }
    `;
        return this.request(query, { id: listId });
    }
    // ── Records (Todos) ──────────────────────────────────────────────────────
    async listRecords(listId) {
        // If a specific listId is provided, get todos from that list
        if (listId) {
            const result = await this.getTodoListWithTodos(listId);
            if (result.success && result.data) {
                return {
                    success: true,
                    data: {
                        items: result.data.todos || [],
                        totalItems: result.data.todosCount || 0,
                    },
                };
            }
            return result;
        }
        // Otherwise, get all todo lists and aggregate todos from the current project
        const listsResult = await this.listTodoLists();
        if (!listsResult.success || !listsResult.data) {
            return { success: false, error: listsResult.error };
        }
        const allTodos = [];
        for (const list of listsResult.data) {
            const todosResult = await this.getTodoListWithTodos(list.id);
            if (todosResult.success && todosResult.data?.todos) {
                allTodos.push(...todosResult.data.todos.map(t => ({
                    ...t,
                    todoList: { id: list.id, title: list.title },
                })));
            }
        }
        return {
            success: true,
            data: {
                items: allTodos,
                totalItems: allTodos.length,
            },
        };
    }
    async getRecord(recordId) {
        const query = `
      query GetRecord($id: String!) {
        todo(id: $id) {
          id
          uid
          title
          text
          done
          archived
          color
          duedAt
          createdAt
          updatedAt
          todoCustomFields {
            id
            value
            customField {
              id
              name
              type
            }
          }
          users {
            id
            email
            fullName
          }
        }
      }
    `;
        return this.request(query, { id: recordId });
    }
    async createRecord(title, listId, customFields) {
        const query = `
      mutation CreateRecord($input: TodoCreateInput!) {
        todoCreate(input: $input) {
          id
          uid
          title
          done
          createdAt
        }
      }
    `;
        return this.request(query, {
            input: {
                title,
                ...(listId ? { todoListId: listId } : {}),
                ...(customFields ? { customFields } : {}),
            },
        });
    }
    async updateRecord(recordId, updates) {
        const query = `
      mutation UpdateRecord($id: String!, $input: TodoUpdateInput!) {
        todoUpdate(id: $id, input: $input) {
          id
          title
          done
          text
          updatedAt
        }
      }
    `;
        return this.request(query, { id: recordId, input: updates });
    }
    async toggleRecordDone(recordId, done) {
        return this.updateRecord(recordId, { done });
    }
    // ── Custom Fields ────────────────────────────────────────────────────────
    async listCustomFields() {
        const query = `
      query CustomFieldList {
        customFieldList {
          items {
            id
            name
            type
          }
        }
      }
    `;
        const result = await this.request(query);
        if (result.success && result.data?.customFieldList) {
            return { success: true, data: result.data.customFieldList.items };
        }
        return result;
    }
    // ── Todo Groups ──────────────────────────────────────────────────────────
    async getTodoGroups(type, companyId) {
        const cid = companyId || this.companyId;
        const query = `
      query TodoGroups($type: TodoGroupType!, $filter: TodosFilter!) {
        todoGroups(type: $type, filter: $filter) {
          items {
            id
            name
            type
            todoCount
          }
          pageInfo {
            totalItems
            hasNextPage
          }
        }
      }
    `;
        const result = await this.request(query, {
            type,
            filter: { companyIds: [cid] },
        });
        if (result.success && result.data?.todoGroups) {
            return {
                success: true,
                data: {
                    items: result.data.todoGroups.items,
                    totalItems: result.data.todoGroups.pageInfo?.totalItems || 0,
                },
            };
        }
        return result;
    }
}
// ── Singleton Export ─────────────────────────────────────────────────────────
export const blueCc = new BlueCcClient();
//# sourceMappingURL=omni-blue.js.map