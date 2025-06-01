import { Tile } from "./tile.ts";
import { Board as BoardInterface } from "./board.interface.ts";
import { Player } from "../player/player.ts";
import { ActionPlace } from "./action-place.ts";
import { GameError } from "./utils/error.ts";

export class Board implements BoardInterface {
  players: Player[] = [];
  private turnOrder: Player[] = [];

  constructor(public tiles: Tile[], public actionPlaces: ActionPlace[]) {}

  setFirstPlayer(player: Player): void {
    this.turnOrder = this.players.filter((p) => p !== player);
    this.turnOrder.unshift(player);
  }

  nextPlayer(): Player {
    const current = this.turnOrder.shift();
    if (!current) {
      throw new GameError("board:no_players_in_turn_order");
    }
    this.turnOrder.push(current);
    return current;
  }
}
