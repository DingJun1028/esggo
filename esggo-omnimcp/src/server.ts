import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { executeMCPService } from './omnimcp-entry';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('call-mcp', async (data) => {
    try {
      const { service, action, payload } = data;
      const result = await executeMCPService(service, action, payload);
      socket.emit('mcp-result', { success: true, result });
    } catch (err) {
      socket.emit('mcp-result', { success: false, error: err.message });
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