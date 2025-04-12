import { Tile } from "./tile.ts";

const STEPS_PER_BOARD = 3;
const SLOTS_PER_STEP = 4;

export enum PlayerColor {
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  YELLOW = "yellow",
}

export class Step {
  slots: Slot[] = [];

  constructor(public row: number) {
    this.slots = Array.from(
      { length: SLOTS_PER_STEP },
      (index: number) => new Slot(row, index)
    );
  }
}

export class Slot {
  tile: Tile | null = null;

  constructor(public row: number, public column: number) {}
}

export class PlayerBoard {
  steps: Step[] = [];

  constructor(public player: string, public color: PlayerColor) {
    this.steps = Array.from(
      { length: STEPS_PER_BOARD },
      (index: number) => new Step(index)
    );
  }
}
