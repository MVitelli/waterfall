import { PlayerBoard } from "../components/player-board.ts";
import { Action } from "../game/action.ts";

export class Player {
  private resources: Record<string, number> = {};

  constructor(
    public name: string = "",
    public board: PlayerBoard,
    public actions: Action[]
  ) {}

  addResource(resource: string, amount: number) {
    if (!this.resources[resource]) {
      this.resources[resource] = 0;
    }
    this.resources[resource] += amount;
  }

  getResource(resource: string): number {
    return this.resources[resource] || 0;
  }
}
