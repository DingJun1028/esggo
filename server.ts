import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { executeMCPService } from './src/omnimcp-entry.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" }
});

// Serve static files (your HTML/CSS/JS for the Pencil design)
app.use(express.static(path.join(__dirname, '../public')));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle MCP service calls from UI
  socket.on('call-mcp', async (data) => {
    try {
      const { service, action, payload } = data;
      const result = await executeMCPService(service, action, payload);
      socket.emit('mcp-result', { success: true, result });
    } catch (err) {
      socket.emit('mcp-result', { success: false, error: err instanceof Error ? err.message : String(err) });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`OmniMCP server running on http://localhost:${PORT}`);
});