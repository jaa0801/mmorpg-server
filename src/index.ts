import express from "express";
import { createServer } from "http";
import { Server } from "colyseus";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

// Create express app
const app = express();

// ✅ Enable CORS so that browsers or Apps Script can connect
app.use(cors({
  origin: "*", // You can replace with your specific domain if needed
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Handle preflight requests
app.options("*", cors());

// Create HTTP server
const server = createServer(app);

// Create Colyseus server with HTTP server
const gameServer = new Server({ server });

// ✅ Define your game room
gameServer.define("game_room", GameRoom);
console.log("✅ Room defined: game_room");

// ✅ Start server
const PORT = process.env.PORT || 2567;
gameServer.listen(PORT);

console.log(`🚀 Colyseus server with CORS enabled is running on port ${PORT}`);
