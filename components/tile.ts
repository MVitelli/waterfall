import { ResourceAmount } from "./resource.ts";

export enum Biome {
  DESERT = "desert",
  FOREST = "forest",
  JUNGLE = "jungle",
  MOUNTAINS = "mountains",
  STEPPE = "steppe",
}

export enum AnimalType {
  BIRD = "bird",
  FISH = "fish",
  INSECT = "insect",
  PREDATOR = "predator",
  PRIMATE = "primate",
  REPTILE = "reptile",
}

export enum TileTier {
  ONE = 1,
  TWO,
}

export class Tile {
  waterCubes: boolean[] = Array(3).fill(false);

  constructor(
    public cost: ResourceAmount[],
    public production: ResourceAmount[],
    public tier: TileTier,
    public biome: Biome,
    public animals: AnimalType[]
  ) {}
}
