const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const routes = require("./routes");
const setupChatWebSocket = require("./sockets/chatSocket"); // renamed setup
const http = require("http");
const WebSocket = require("ws");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Pure WebSocket server
const wss = new WebSocket.Server({ server, path: "/chat" });

// Initialize WebSocket handlers
try {
  setupChatWebSocket(wss);
  console.log('🟢 WebSocket handlers initialized');
} catch (error) {
  console.error('🔴 Failed to initialize WebSocket handlers:', error);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
const connectMongo = require("./config/mongo");
connectMongo().catch((error) => {
  console.error('🔴 MongoDB connection failed:', error);
});

// Routes
app.use("/api", routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔴 Express error:', err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = { app, server };
