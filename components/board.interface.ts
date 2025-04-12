import { Player } from "../player/player.ts";
import { Tile } from "./tile.ts";

export class ActionPlace {
  workers: Worker[] = [];

  constructor(public maxWorkers: number) {}

  placeWorker(worker: Worker) {
    if (this.workers.length >= this.maxWorkers) {
      throw new Error("Max workers reached");
    }
    this.workers.push(worker);
  }

  removeWorker(worker: Worker) {
    this.workers = this.workers.filter((w) => w !== worker);
  }
}

export interface Board {
  tiles: Tile[];
  actionPlaces: ActionPlace[];
  players: Player[];

  nextPlayer: () => Player;
}
