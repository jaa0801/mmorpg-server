import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    // Handle movement message from client
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      if (data.direction === "up") {
        player.y -= 1;
        player.animation = player.imageWalkUp;
      } else if (data.direction === "down") {
        player.y += 1;
        player.animation = player.imageWalkDown;
      } else if (data.direction === "left") {
        player.x -= 1;
        player.animation = player.imageWalkLeft;
      } else if (data.direction === "right") {
        player.x += 1;
        player.animation = player.imageWalkRight;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    
    const player = new Player();
    player.x = 100;
    player.y = 100;
    player.imageIdleFront = options.imageIdleFront;
    player.imageWalkLeft = options.imageWalkLeft;
    player.imageWalkRight = options.imageWalkRight;
    player.imageWalkUp = options.imageWalkUp;
    player.imageWalkDown = options.imageWalkDown;
    player.animation = options.imageIdleFront;

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
