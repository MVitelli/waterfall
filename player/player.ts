import { PlayerBoard } from "../components/player-board.ts";
import { Action } from "../game/action.ts";

export class Player {
  constructor(
    public name: string = "",
    public board: PlayerBoard,
    public actions: Action[]
  ) {}
}
