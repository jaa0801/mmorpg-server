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

      // Move player
      player.PositionX += data.dx * speed;
      player.PositionY += data.dy * speed;

      // Clamp within map bounds
      player.PositionX = Math.max(0, Math.min(player.PositionX, 1000));
      player.PositionY = Math.max(0, Math.min(player.PositionY, 1000));

      // Set appropriate animation
      if (data.dx > 0.5) {
        player.animation = player.ImageURL_Walk_Right;
      } else if (data.dx < -0.5) {
        player.animation = player.ImageURL_Walk_Left;
      } else if (data.dy > 0.5) {
        player.animation = player.ImageURL_Walk_Down;
      } else if (data.dy < -0.5) {
        player.animation = player.ImageURL_Walk_Up;
      } else {
        player.animation = player.ImageURL_IdleFront;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log("👤", client.sessionId, "joined", options);

    const character = options.character;
    const player = new Player();

    // ✅ Match frontend naming
    player.CharacterName = character.CharacterName || "Player";
    player.PositionX = Number(character.PositionX);
    player.PositionY = Number(character.PositionY);

    player.ImageURL_IdleFront = character.ImageURL_IdleFront;
    player.ImageURL_Walk_Left = character.ImageURL_Walk_Left;
    player.ImageURL_Walk_Right = character.ImageURL_Walk_Right;
    player.ImageURL_Walk_Up = character.ImageURL_Walk_Up || character.ImageURL_Walk_Right;
    player.ImageURL_Walk_Down = character.ImageURL_Walk_Down || character.ImageURL_Walk_Left;

    player.animation = player.ImageURL_IdleFront;

    this.state.players.set(client.sessionId, player);

    console.log("✅ Player added to state:", {
      sessionId: client.sessionId,
      CharacterName: player.CharacterName,
      PositionX: player.PositionX,
      PositionY: player.PositionY,
      animation: player.animation
    });
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    console.log("👋", client.sessionId, "left");
  }

  onDispose() {
    console.log("🧹 Room", this.roomId, "disposing...");
  }
}
