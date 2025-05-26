import { Player } from "../player/player.ts";
import { Tile } from "./tile.ts";
import { ActionPlace } from "./action-place.ts";

export interface Board {
  tiles: Tile[];
  actionPlaces: ActionPlace[];
  players: Player[];

  nextPlayer: () => Player;
}
