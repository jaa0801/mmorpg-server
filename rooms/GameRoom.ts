import { Room, Client } from "colyseus";

export class GameRoom extends Room {
  onCreate(options: any) {
    console.log("GameRoom created");
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined", options);
  }

  onLeave(client: Client) {
    console.log(client.sessionId, "left");
  }

  onDispose() {
    console.log("GameRoom disposed");
  }
}
