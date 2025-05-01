import { Tile } from "./tile.ts";
import { ActionPlace, Board as BoardInterface } from "./board.interface.ts";
import { Player } from "../player/player.ts";
import { Worker } from "./worker.ts";

export class Board implements BoardInterface {
  players: Player[] = [];

  constructor(public tiles: Tile[], public actionPlaces: ActionPlace[]) {}

  nextPlayer(): Player {
    return this.players[Math.floor(Math.random() * this.players.length)];
  }
}

export class UniqueActionPlace extends ActionPlace {
  override maxWorkers = 1;
}

export class IncrementalActionPlace extends ActionPlace {
  override additionalConstraints(workers: Worker[]) {
    const required = this.requiredWorkers();
    if (workers.length !== required) {
      throw new Error(`You need to place ${required} workers`);
    }
  }

  requiredWorkers() {
    const workersByPlayer = this.workers.reduce((prev, curr) => {
      const playerName = curr.owner.name;
      if (!prev[playerName]) prev[playerName] = 0;
      prev[playerName] += 1;
      return prev;
    }, {} as Record<string, number>);

    const [playerWithMoreWorkers] = Object.entries(workersByPlayer).sort(
      ([, workersA], [, workersB]) => workersB - workersA
    );

    return playerWithMoreWorkers ? playerWithMoreWorkers.at(1) : 1;
  }
}
