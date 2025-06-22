"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const colyseus_1 = require("colyseus");
class GameRoom extends colyseus_1.Room {
    onCreate(options) {
        console.log("GameRoom created");
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined", options);
    }
    onLeave(client) {
        console.log(client.sessionId, "left");
    }
    onDispose() {
        console.log("GameRoom disposed");
    }
}
exports.GameRoom = GameRoom;
