import { Player } from "../player/player.ts";
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

  constructor(public color: PlayerColor) {
    this.steps = [
      new Step(1, TileTier.ONE),
      new Step(2, TileTier.ONE),
      new Step(3, TileTier.TWO),
    ];
  }

  /**
   * Simulates water flowing down through a terraced board structure (like a waterfall).
   * Water starts from the top-left and flows downward, stopping at tiles to activate them,
   * or falling to the next row when it encounters an empty slot.
   *
   * @param board - The player board containing rows of tile slots
   */
  runWaterCascade(player: Player) {
    const rows = this.steps;
    const numRows = rows.length;
    const numCols = rows[0].slots.length;

    // Track which column the water starts flowing from in each row
    // Initially starts from column 0 (leftmost)
    let startCol = 0;

    // Process each row from top to bottom
    for (let row = 0; row < numRows; row++) {
      // Track where water will fall to the next row (-1 means no fall)
      let waterFallsToNextRowAtCol = -1;

      // Flow water across the current row, starting from startCol
      for (let col = startCol; col < numCols; col++) {
        const slot = rows[row].slots[col];

        // If we encounter an empty slot, water falls through to next row
        if (!slot.tile) {
          waterFallsToNextRowAtCol = col;
          break; // Stop flowing in this row
        }

        // If there's a tile, water stops here:
        // 1. Add a water cube to the tile
        // 2. Activate the tile's production
        slot.tile.waterCubes++;
        slot.tile.produce(player);
      }

      // If water never fell through (all slots had tiles), cascade ends
      if (waterFallsToNextRowAtCol === -1) {
        break;
      }

      // For the next row, start flowing from where water fell
      startCol = waterFallsToNextRowAtCol;
    }
  }
}
