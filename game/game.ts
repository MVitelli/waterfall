import { Board } from "../components/board.ts";

export class Game {
  constructor(public players: string[], public board: Board) {}
}
