import { Room, Client } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class GameRoom extends Room<MyRoomState> {
  maxClients = 16;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    // 🕹️ Handle player movement input
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      const speed = 2;

      // Move player
      player.x += data.dx * speed;
      player.y += data.dy * speed;

      // Clamp within map bounds
      player.x = Math.max(0, Math.min(player.x, 1000));
      player.y = Math.max(0, Math.min(player.y, 1000));

      // Choose animation based on direction
      if (data.dx > 0.5) {
        player.animation = player.imageWalkRight;
      } else if (data.dx < -0.5) {
        player.animation = player.imageWalkLeft;
      } else if (data.dy > 0.5) {
        player.animation = player.imageWalkDown;
      } else if (data.dy < -0.5) {
        player.animation = player.imageWalkUp;
      } else {
        player.animation = player.imageIdleFront;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined", options);

    const character = options.character;
    const player = new Player();

    // ✅ Set all values BEFORE adding to state
    player.name = character.CharacterName || "Player";
    player.x = Number(character.PositionX) * 20;
    player.y = Number(character.PositionY) * 20;

    // ✅ Assign animations
    player.imageIdleFront = character.ImageURL_IdleFront;
    player.imageWalkLeft = character.ImageURL_Walk_Left;
    player.imageWalkRight = character.ImageURL_Walk_Right;
    player.imageWalkUp = character.ImageURL_Walk_Up || character.ImageURL_Walk_Right;
    player.imageWalkDown = character.ImageURL_Walk_Down || character.ImageURL_Walk_Left;

    // ✅ Set default animation
    player.animation = player.imageIdleFront;

    // ✅ Only now add to Colyseus state
    this.state.players.set(client.sessionId, player);

    console.log("✅ Player initialized:", {
      sessionId: client.sessionId,
      name: player.name,
      x: player.x,
      y: player.y,
      animation: player.animation
    });
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
