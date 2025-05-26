import { Tile } from "./tile.ts";
import { Board as BoardInterface } from "./board.interface.ts";
import { Player } from "../player/player.ts";
import { ActionPlace, createProductionPlace } from "./action-place.ts";

export class Board implements BoardInterface {
  players: Player[] = [];

  constructor(public tiles: Tile[], public actionPlaces: ActionPlace[]) {}

  nextPlayer(): Player {
    return this.players[Math.floor(Math.random() * this.players.length)];
  }
}

// Create standard action places
export const ProductionActionPlace = createProductionPlace("wood", 1);
