import express from "express";
import { createServer } from "http";
import { Server } from "colyseus";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

const app = express();

// Enable CORS for Google Apps Script
app.use(cors({
  origin: "*", // Optional: tighten to your domain if needed
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

const server = createServer(app);
const gameServer = new Server({ server });

// ✅ Define multiple rooms for maps
["map_1", "map_2"].forEach(roomName => {
  gameServer.define(roomName, GameRoom);
  console.log(`✅ Room defined: ${roomName}`);
});

// Start the server
gameServer.listen(2567);
console.log("🚀 Colyseus server with CORS enabled is running on port 2567");
