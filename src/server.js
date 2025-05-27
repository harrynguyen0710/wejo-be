require('dotenv').config();

// src/server.js
const { app, server } = require('./app.js'); // Import server along with app
const { PrismaClient } = require("./generated/prisma/client.js") 

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Optional: Test DB connection
    await prisma.$connect();
    console.log('🟢 Connected to the PostgreSQL database');

    server.listen(PORT,'192.168.96.173', () => {
      console.log(`🚀 Server is running on http://xxx.xxx.xx.xxx:${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
