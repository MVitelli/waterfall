import { Player } from "../player/player.ts";
import { Worker } from "./worker.ts";

export interface ActionBehavior {
  execute(place: ActionPlace, player: Player, workers: Worker[]): void;
}

export interface PlacementRule {
  validate(place: ActionPlace, workers: Worker[]): boolean;
  getErrorMessage(): string;
}

// Main ActionPlace class
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
    // Check basic availability
    if (!this.isAvailable(workers.length)) {
      throw new Error("Max workers reached");
    }

    // Check additional rules
    for (const rule of this.placementRules) {
      if (!rule.validate(this, workers)) {
        throw new Error(rule.getErrorMessage());
      }
    }

    this.currentWorkers.push(...workers);
  }

  isAvailable(workersToPlace: number) {
    return this.currentWorkers.length + workersToPlace <= this.maxWorkers;
  }

  removeWorker(worker: Worker) {
    this.currentWorkers = this.currentWorkers.filter((w) => w !== worker);
  }

  execute(player: Player, workers: Worker[]) {
    for (const behavior of this.behaviors) {
      behavior.execute(this, player, workers);
    }
  }
}

// Common placement rules
export class UniqueWorkerRule implements PlacementRule {
  validate(place: ActionPlace, _workers: Worker[]): boolean {
    return place.currentWorkers.length === 0;
  }

  getErrorMessage(): string {
    return "This place can only have one worker";
  }
}

export class IncrementalWorkerRule implements PlacementRule {
  validate(place: ActionPlace, workers: Worker[]): boolean {
    return workers.length === this.requiredWorkers(place);
  }

  getErrorMessage(): string {
    return `You need to place the correct number of workers`;
  }

  private requiredWorkers(place: ActionPlace) {
    const workersByPlayer = place.currentWorkers.reduce((prev, curr) => {
      const playerName = curr.owner.name;
      if (!prev[playerName]) prev[playerName] = 0;
      prev[playerName] += 1;
      return prev;
    }, {} as Record<string, number>);

    const entries = Object.entries(workersByPlayer);
    if (entries.length === 0) return 1;

    entries.sort(([, workersA], [, workersB]) => workersB - workersA);
    return entries[0][1];
  }
}

// Common action behaviors
export class ResourceProductionBehavior implements ActionBehavior {
  constructor(private resource: string, private amount: number) {}

  execute(_place: ActionPlace, player: Player, workers: Worker[]): void {
    player.addResource(this.resource, this.amount * workers.length);
  }
}

// Factory functions to create common action places
export function createProductionPlace(
  resourceType: string,
  amount: number
): ActionPlace {
  return new ActionPlace(
    3, // Maximum workers
    `${
      resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
    } Production`,
    [new ResourceProductionBehavior(resourceType, amount)],
    [new IncrementalWorkerRule()]
  );
}

export function createMarketPlace(): ActionPlace {
  return new ActionPlace(
    1, // Maximum workers
    "Market",
    [
      // Add market behaviors here
    ],
    [new UniqueWorkerRule()]
  );
}
