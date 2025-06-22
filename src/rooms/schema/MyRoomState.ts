import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name = "";
  @type("number") x = 0;
  @type("number") y = 0;

  @type("string") animation = "";
  @type("string") imageIdleFront = "";
  @type("string") imageWalkLeft = "";
  @type("string") imageWalkRight = "";
  @type("string") imageWalkUp = "";
  @type("string") imageWalkDown = "";
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
