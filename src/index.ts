import express from "express";
import { createServer } from "http";
import { Server } from "colyseus";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

const app = express();

// Enable CORS for Google Apps Script
app.use(cors({
  origin: "*", // Optional: restrict to your Apps Script domain
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

const server = createServer(app);
const gameServer = new Server({ server });

// ✅ Define only one room: "game_room"
gameServer.define("game_room", GameRoom);
console.log("✅ Room defined: game_room");

// Start the server
gameServer.listen(2567);
console.log("🚀 Colyseus server with CORS enabled is running on port 2567");
