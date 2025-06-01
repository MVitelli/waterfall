import { Board } from "../components/board.ts";
import { Player } from "../player/player.ts";

export class Game {
  constructor(public players: Player[], public board: Board) {}
}
