const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server is running');
});

// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🟢 Client connected');

  ws.on('message', (message) => {
    console.log('📩 Received:', message.toString());
    ws.send(`Server says: You sent -> ${message}`);
  });

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('🚀 WebSocket server listening on ws://localhost:5000');
});
