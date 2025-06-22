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

      // Clamp values to prevent out-of-bounds movement
      player.x = Math.max(0, Math.min(player.x, 1000));
      player.y = Math.max(0, Math.min(player.y, 1000));

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

    // ✅ FIXED: Proper number conversion (no fallback to 100)
    player.x = Number(character.PositionX) * 20;
    player.y = Number(character.PositionY) * 20;

    // Assign sprites
    player.animation = character.ImageURL_IdleFront;
    player.imageIdleFront = character.ImageURL_IdleFront;
    player.imageWalkLeft = character.ImageURL_Walk_Left;
    player.imageWalkRight = character.ImageURL_Walk_Right;
    player.imageWalkUp = character.ImageURL_Walk_Up || character.ImageURL_Walk_Right;
    player.imageWalkDown = character.ImageURL_Walk_Down || character.ImageURL_Walk_Left;

    player.name = character.CharacterName || "Player";

    this.state.players.set(client.sessionId, player);

    console.log("✅ Player initialized:", {
      x: player.x,
      y: player.y,
      name: player.name,
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
