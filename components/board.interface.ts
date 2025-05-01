import { Player } from "../player/player.ts";
import { Tile } from "./tile.ts";
import { Worker } from "./worker.ts";

export abstract class ActionPlace {
  workers: Worker[] = [];

  constructor(public maxWorkers: number) {}

  placeWorkers(workers: Worker[]) {
    this.additionalConstraints(workers);
    if (!this.isAvailable(workers.length)) {
      throw new Error("Max workers reached");
    }
    this.workers.push(...workers);
  }

  isAvailable(workersToPlace: number) {
    return this.workers.length + workersToPlace <= this.maxWorkers;
  }

  removeWorker(worker: Worker) {
    this.workers = this.workers.filter((w) => w !== worker);
  }

  additionalConstraints(_workers: Worker[]) {}
}

export interface Board {
  tiles: Tile[];
  actionPlaces: ActionPlace[];
  players: Player[];

  nextPlayer: () => Player;
}
