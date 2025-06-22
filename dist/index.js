"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const colyseus_1 = require("colyseus");
const GameRoom_1 = require("./rooms/GameRoom");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// ✅ Enable CORS for Google Apps Script or any origin
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));
// ✅ Handle preflight CORS requests
app.options("*", (0, cors_1.default)());
const server = (0, http_1.createServer)(app);
const gameServer = new colyseus_1.Server({ server });
// ✅ Define the Colyseus room for your MMORPG
gameServer.define("game_room", GameRoom_1.GameRoom);
// ✅ Start listening on port 2567 (Render must detect this)
gameServer.listen(2567);
console.log("✅ Colyseus server with CORS enabled is running on port 2567");
