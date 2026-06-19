/**
 * BlueService - Handles bi-directional synchronization with Blue CC.
 * Based on Blue's 100% GraphQL API coverage.
 */

export class BlueService {
    private static API_URL = "https://app.bloo.io/graphql"; // Standard Blue GraphQL endpoint

    /**
     * Posts a comment to a Blue Todo.
     * Supports both Bearer token and PAT (Personal Access Token) headers.
     */
    static async postComment(todoId: string, content: string, credentials: { apiKey?: string, tokenId?: string, tokenSecret?: string, companyId?: string }) {
        const query = `
            mutation CreateComment($todoId: ID!, $content: String!) {
                createComment(input: { todoId: $todoId, content: $content }) {
                    comment {
                        id
                        content
                    }
                }
            }
        `;

        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };

        if (credentials.tokenId && credentials.tokenSecret) {
            headers["x-bloo-token-id"] = credentials.tokenId;
            headers["x-bloo-token-secret"] = credentials.tokenSecret;
            if (credentials.companyId) headers["x-bloo-company-id"] = credentials.companyId;
        } else if (credentials.apiKey) {
            headers["Authorization"] = `Bearer ${credentials.apiKey}`;
        }

        try {
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    query,
                    variables: { todoId, content }
                })
            });
            // ... rest of the logic

            const result = await response.json();
            if (result.errors) {
                console.error("[BlueService] GraphQL Errors:", result.errors);
                return { success: false, errors: result.errors };
            }

            return { success: true, data: result.data.createComment.comment };
        } catch (error) {
            console.error("[BlueService] Fetch Error:", error);
            return { success: false, error };
        }
    }

    /**
     * Updates specific fields of a Blue Todo.
     */
    static async updateTodo(todoId: string, updates: any, credentials: { apiKey?: string, tokenId?: string, tokenSecret?: string, companyId?: string }) {
        const query = `
            mutation UpdateTodo($id: ID!, $input: UpdateTodoInput!) {
                updateTodo(id: $id, input: $input) {
                    todo {
                        id
                        done
                    }
                }
            }
        `;

        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };

        if (credentials.tokenId && credentials.tokenSecret) {
            headers["x-bloo-token-id"] = credentials.tokenId;
            headers["x-bloo-token-secret"] = credentials.tokenSecret;
            if (credentials.companyId) headers["x-bloo-company-id"] = credentials.companyId;
        } else if (credentials.apiKey) {
            headers["Authorization"] = `Bearer ${credentials.apiKey}`;
        }

        try {
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    query,
                    variables: { id: todoId, input: updates }
                })
            });

            const result = await response.json();
            return { success: !result.errors, data: result.data?.updateTodo.todo, errors: result.errors };
        } catch (error) {
            return { success: false, error };
        }
    }

    /**
     * Higher-level logic: Back-fills evidence from an ESG Go Audit.
     */
    static async backfillAuditResult(todoId: string, auditName: string, evidenceUrl: string, credentials: { apiKey?: string, tokenId?: string, tokenSecret?: string, companyId?: string }) {
        const content = `🛡️ **ESG Audit Completed: ${auditName}**\n\nThe audit evidence has been secured and deposited on OmniSovereign.\n\n🔗 [View Evidence Vault](${evidenceUrl})`;
        return this.postComment(todoId, content, credentials);
    }
}
