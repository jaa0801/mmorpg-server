import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") CharacterName = "";
  @type("number") PositionX = 0;
  @type("number") PositionY = 0;

  @type("string") animation = "";
  @type("string") ImageURL_IdleFront = "";
  @type("string") ImageURL_Walk_Left = "";
  @type("string") ImageURL_Walk_Right = "";
  @type("string") ImageURL_Walk_Up = "";
  @type("string") ImageURL_Walk_Down = "";
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
