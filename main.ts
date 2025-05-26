import { Board } from "./components/board.ts";
import { Game } from "./game/game.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const board = new Board([], []);
  const _game = new Game(["Maxi", "Dani"], board);
}
