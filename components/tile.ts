import { ResourceAmount } from "./resource.ts";

export enum TileTier {
  ONE = 1,
  TWO,
}

export class Tile {
  waterCubes: boolean[] = Array(3).fill(false);

  constructor(
    public cost: ResourceAmount[],
    public production: ResourceAmount[],
    public tier: TileTier
  ) {}
}
