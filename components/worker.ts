import { Player } from "../player/player.ts";

export class Worker {
  constructor(public owner: Player, public isAvailable: boolean = true) {}
}
