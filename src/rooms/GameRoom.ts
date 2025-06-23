import { Room, Client } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class GameRoom extends Room<MyRoomState> {
  maxClients = 16;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    // ✅ Handle incoming movement input
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      const speed = 2;

      // Apply movement
      player.PositionX += data.dx * speed;
      player.PositionY += data.dy * speed;

      // Clamp position within map bounds
      player.PositionX = Math.max(0, Math.min(player.PositionX, 1000));
      player.PositionY = Math.max(0, Math.min(player.PositionY, 1000));

      // Determine direction and set animation
      let direction = "idle";

      if (data.dx > 0.5) {
        direction = "right";
        player.animation = player.ImageURL_Walk_Right;
      } else if (data.dx < -0.5) {
        direction = "left";
        player.animation = player.ImageURL_Walk_Left;
      } else if (data.dy > 0.5) {
        direction = "down";
        player.animation = player.ImageURL_Walk_Down;
      } else if (data.dy < -0.5) {
        direction = "up";
        player.animation = player.ImageURL_Walk_Up;
      } else {
        direction = "idle";
        player.animation = player.ImageURL_IdleFront;
      }

      player.Direction = direction;

      // Optional: broadcast to all clients (can be removed if you rely on .onChange only)
      this.broadcast("move", {
        sessionId: client.sessionId,
        x: player.PositionX,
        y: player.PositionY,
        direction,
      });
    });
  }

  onJoin(client: Client, options: any) {
    console.log("👤", client.sessionId, "joined", options);

    const character = options.character;
    const player = new Player();

    // ✅ Populate player schema from client
    player.CharacterName = character.CharacterName || "Player";
    player.PositionX = Number(character.PositionX) || 100;
    player.PositionY = Number(character.PositionY) || 100;

    player.ImageURL_IdleFront = character.ImageURL_IdleFront || "";
    player.ImageURL_Walk_Left = character.ImageURL_Walk_Left || "";
    player.ImageURL_Walk_Right = character.ImageURL_Walk_Right || "";
    player.ImageURL_Walk_Up = character.ImageURL_Walk_Up || character.ImageURL_Walk_Right || "";
    player.ImageURL_Walk_Down = character.ImageURL_Walk_Down || character.ImageURL_Walk_Left || "";

    player.animation = player.ImageURL_IdleFront;
    player.Direction = "idle";

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
