import { TuttleConfig } from "@tenback/tunnel-sdk";

// Tuttle configuration – strict TypeScript, no "any"
const config: TuttleConfig = {
  // Core tunnel settings
  core: {
    maxConnections: 10,
    idleTimeoutMs: 30_000,
    keyPrefix: "dist_tunnel"
  },
  // Security – JWT stored in .env
  auth: {
    jwt: process.env.TUTTLE_JWT || "",
    algorithm: "HS256"
  },
  // Nodes definition – used for bidirectional sync
  nodes: {
    "node-rtc": {
      type: "rtc-node",
      host: "localhost",
      port: 8080,
      protocol: "ws"
    },
    "node-meta": {
      type: "meta-node",
      data: { sync: "strong" }
    }
  },
  // Channels for comment synchronization
  channels: {
    comments: {
      name: "tuttle-comments",
      group: "default"
    }
  },
  // Permissions – role based access control
  permissions: {
    roles: ["ADMIN", "DEVELOPER"],
    default: "DEVELOPER"
  },
  // Validation settings – run hourly
  validation: {
    scheduleSeconds: 3600,
    strict: true
  }
};

export default config;
