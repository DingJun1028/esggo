import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { CelestialLifecycleManager } from "./celestial-lifecycle";

/**
 * 🏛️ OmniOneServer: The central node of the Celestial Command framework.
 */
class OmniOneServer {
    private server: Server;
    private library = new Map<string, any>();

    constructor() {
        this.server = new Server(
            { name: "OmniOne-Celestial-Node", version: "1.0.0" },
            { capabilities: { resources: {}, tools: {} } }
        );

        this.setupHandlers();
    }

    private setupHandlers() {
        // 📖 Resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: Array.from(this.library.keys()).map((uuid) => ({
                uri: `omnione://artifact/${uuid}`,
                name: `Artifact ${uuid}`,
                mimeType: "application/json",
            })),
        }));

        this.server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
            const uuid = req.params.uri.split("/").pop();
            const artifact = this.library.get(uuid!);
            if (!artifact) throw new Error("Artifact not found");
            return {
                contents: [{
                    uri: req.params.uri,
                    mimeType: "application/json",
                    text: JSON.stringify(artifact),
                }],
            };
        });

        // ⚙️ Tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "forge_celestial_artifact",
                    description: "Forge a new 5T artifact with immutable core.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            originator: { type: "string" },
                            payload: { type: "object" }
                        },
                        required: ["originator", "payload"]
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (req) => {
            if (req.params.name === "forge_celestial_artifact") {
                const { originator, payload } = req.params.arguments as any;
                const artifact = await CelestialLifecycleManager.forgeInit(payload, originator);
                const uuid = (artifact as any)._core?.uuid;
                if (uuid) {
                    this.library.set(uuid, artifact);
                }
                return {
                    content: [{ type: "text", text: JSON.stringify({ status: "FORGED", uuid: uuid }) }]
                };
            }
            throw new Error("Tool not found");
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log("OmniOne MCP Node Awake.");
    }
}

// export const omniOneServer = new OmniOneServer();
