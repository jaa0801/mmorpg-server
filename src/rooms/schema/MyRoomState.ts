import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x = 100;
  @type("number") y = 100;
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
