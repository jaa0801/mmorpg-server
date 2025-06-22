import express from "express";
import { createServer } from "http";
import { Server } from "colyseus";
import { GameRoom } from "./rooms/GameRoom";
import cors from "cors";

const app = express();

// ✅ Enable CORS for Google Apps Script or any origin
app.use(cors({
  origin: "*", // Optional: replace with your Apps Script origin for better security
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ Handle preflight CORS requests
app.options("*", cors());

const server = createServer(app);
const gameServer = new Server({ server });

// ✅ Define the Colyseus room for your MMORPG
gameServer.define("game_room", GameRoom);

// ✅ Start listening on port 2567 (Render must detect this)
gameServer.listen(2567);
console.log("✅ Colyseus server with CORS enabled is running on port 2567");
