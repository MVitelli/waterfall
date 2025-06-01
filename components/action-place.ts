import { Game } from "../game/game.ts";
import { Player } from "../player/player.ts";
import { GameError } from "./utils/error.ts";
import { Worker } from "./worker.ts";

export interface ActionBehavior {
  execute({
    place,
    player,
    workers,
    game,
  }: {
    place: ActionPlace;
    player: Player;
    workers: Worker[];
    game?: Game;
  }): void;
}

type PlacementRule = {
  validate: (place: ActionPlace, workers: Worker[]) => boolean;
  getErrorMessage: (place: ActionPlace) => string;
  name: string;
};

export class ActionPlace {
  currentWorkers: Worker[] = [];
  private behaviors: ActionBehavior[] = [];
  private placementRules: PlacementRule[] = [];

  constructor(
    public maxWorkers: number,
    public name: string,
    behaviors: ActionBehavior[] = [],
    placementRules: PlacementRule[] = []
  ) {
    this.behaviors = behaviors;
    this.placementRules = placementRules;
  }

  placeWorkers(workers: Worker[]) {
    if (!this.isAvailable(workers.length)) {
      throw new GameError("placement:max_workers", { place: this.name });
    }

    for (const rule of this.placementRules) {
      if (!rule.validate(this, workers)) {
        throw new Error(rule.getErrorMessage(this));
      }
    }

    this.currentWorkers.push(...workers);
    return this;
  }

  isAvailable(workersToPlace: number) {
    return this.currentWorkers.length + workersToPlace <= this.maxWorkers;
  }

  removeWorker(worker: Worker) {
    this.currentWorkers = this.currentWorkers.filter((w) => w !== worker);
    return this;
  }

  execute(player: Player, workers: Worker[], game: Game) {
    for (const behavior of this.behaviors) {
      behavior.execute({ place: this, player, workers, game });
    }
    return this;
  }
}

export const UNIQUE_WORKER_RULE: PlacementRule = {
  name: "unique",
  validate: (place: ActionPlace, _workers: Worker[]) =>
    place.currentWorkers.length === 0,
  getErrorMessage: () => "This place can only have one worker",
};

export const INCREMENTAL_WORKER_RULE: PlacementRule = {
  name: "incremental",
  validate: (place: ActionPlace, workers: Worker[]) => {
    const required = getRequiredIncrementalWorkers(place);
    return workers.length === required;
  },
  getErrorMessage: (place: ActionPlace) => {
    const required = getRequiredIncrementalWorkers(place);
    return `You need to place exactly ${required} worker${
      required === 1 ? "" : "s"
    } for incremental placement`;
  },
};

function getRequiredIncrementalWorkers(place: ActionPlace): number {
  if (place.currentWorkers.length === 0) return 1;

  const workersByPlayer = place.currentWorkers.reduce((acc, worker) => {
    const playerName = worker.owner.name;
    acc[playerName] = (acc[playerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Math.max(...Object.values(workersByPlayer)) + 1;
}

const TURN_ORDER_BEHAVIOR: ActionBehavior = {
  execute({
    player,
    game,
  }: {
    place: ActionPlace;
    player: Player;
    workers: Worker[];
    game: Game;
  }) {
    game.board.setFirstPlayer(player);
  },
};

export const FIRST_PLAYER_ACTION_PLACE: ActionPlace = new ActionPlace(
  1,
  "FirstPlayer",
  [TURN_ORDER_BEHAVIOR],
  [UNIQUE_WORKER_RULE]
);

const PRODUCTION_BEHAVIOR: ActionBehavior = {
  execute({ player }: { player: Player }) {
    player.board.runWaterCascade(player);
  },
};

export const PRODUCTION_PLACE = new ActionPlace(
  1,
  "production",
  [PRODUCTION_BEHAVIOR],
  [INCREMENTAL_WORKER_RULE]
);
