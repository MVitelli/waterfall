import { PlayerBoard } from "../components/player-board.ts";
import { ResourceAmount } from "../components/resource.ts";
import { Action } from "../game/action.ts";

export class Player {
  private resources: Record<string, number> = {};

  constructor(
    public name: string = "",
    public board: PlayerBoard,
    public actions: Action[]
  ) {}

  gain(resource: ResourceAmount) {
    const [resourceType, amount] = resource;
    if (!this.resources[resourceType]) {
      this.resources[resourceType] = 0;
    }
    this.resources[resourceType] += amount;
  }

  getResource(resource: string): number {
    return this.resources[resource] || 0;
  }
}
