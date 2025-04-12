import { ResourceAmount } from "../game/resource.ts";

export class Tile {
  constructor(
    public cost: ResourceAmount[],
    public resources: ResourceAmount[]
  ) {}
}
