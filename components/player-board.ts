import { BoardResource } from "./resource.ts";
import { Tile, TileTier } from "./tile.ts";

const SLOTS_PER_STEP = 7;

export enum PlayerColor {
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  YELLOW = "yellow",
}

export class Step {
  slots: Slot[] = [];

  constructor(public row: number, public tileTier: TileTier) {
    this.slots = Array.from(
      { length: SLOTS_PER_STEP },
      (position: number) => new Slot(row, position + 1)
    );
  }

  placeTile(tile: Tile) {
    const slot = this.slots.find((slot) => slot.tile === null);
    if (!slot) {
      throw new Error("No slot available");
    }
    slot.tile = tile;
  }
}

export class Slot {
  tile: Tile | null = null;
  energyCost: number;

  constructor(public row: number, public column: number) {
    this.energyCost = row - 1 + column;
  }

  getCurrentSlot() {
    return `${this.row}-${this.column}`;
  }
}

export class PlayerBoard {
  steps: Step[] = [];
  resourceTracks: Record<BoardResource, number> = {
    [BoardResource.WOOD]: 0,
    [BoardResource.CLAY]: 0,
    [BoardResource.STONE]: 0,
    [BoardResource.GOLD_COINS]: 0,
  };

  constructor(public player: string, public color: PlayerColor) {
    this.steps = [
      new Step(1, TileTier.ONE),
      new Step(2, TileTier.ONE),
      new Step(3, TileTier.TWO),
    ];
  }
}
