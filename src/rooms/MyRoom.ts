import { Room, Client } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class GameRoom extends Room<MyRoomState> {
  maxClients = 16;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      const speed = 2;

      // Update player position
      player.x += data.dx * speed;
      player.y += data.dy * speed;

      // Update animation based on direction
      if (data.dx > 0.5) player.animation = player.imageWalkRight;
      else if (data.dx < -0.5) player.animation = player.imageWalkLeft;
      else if (data.dy > 0.5) player.animation = player.imageWalkDown;
      else if (data.dy < -0.5) player.animation = player.imageWalkUp;
      else player.animation = player.imageIdleFront;
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined", options);

    const character = options.character;
    const player = new Player();

    player.x = 100;
    player.y = 100;

    // Set default animation and images from character data
    player.animation = character.ImageURL_IdleFront;
    player.imageIdleFront = character.ImageURL_IdleFront;
    player.imageWalkLeft = character.ImageURL_Walk_Left;
    player.imageWalkRight = character.ImageURL_Walk_Right;
    player.imageWalkUp = character.ImageURL_Walk_Up || character.ImageURL_Walk_Right;
    player.imageWalkDown = character.ImageURL_Walk_Down || character.ImageURL_Walk_Left;

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
