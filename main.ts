import { BoardResource, ResourceAmount } from "./components/resource.ts";
import { Tile, Biome, AnimalType, TileTier } from "./components/tile.ts";
import { Player } from "./player/player.ts";
import { PlayerBoard, PlayerColor } from "./components/player-board.ts";
import { PRODUCTION_PLACE } from "./components/action-place.ts";
import { Worker } from "./components/worker.ts";
import { Game } from "./game/game.ts";

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ALL_BIOMES = Object.values(Biome);
const ALL_ANIMALS = Object.values(AnimalType);
const ALL_TIERS = [TileTier.ONE, TileTier.TWO];
const ALL_RESOURCES = Object.values(BoardResource);

function randomResourceAmount(): ResourceAmount {
  const resource = randomChoice(ALL_RESOURCES);
  const amount = randomInt(1, 5);
  return [resource, amount];
}

function randomAnimalArray(): AnimalType[] {
  const count = randomInt(0, 3);
  const animals = new Set<AnimalType>();
  while (animals.size < count) {
    animals.add(randomChoice(ALL_ANIMALS));
  }
  return Array.from(animals);
}

function generateRandomTile(): Tile {
  const costCount = randomInt(1, 3);
  const prodCount = randomInt(1, 3);

  const cost: ResourceAmount[] = Array.from({ length: costCount }, () =>
    randomResourceAmount()
  );
  const production: ResourceAmount[] = Array.from({ length: prodCount }, () =>
    randomResourceAmount()
  );

  const tier = randomChoice(ALL_TIERS);
  const biome = randomChoice(ALL_BIOMES);
  const animals = randomAnimalArray();

  return new Tile(cost, production, tier, biome, animals);
}

function printBoardState(board: PlayerBoard) {
  console.log("\n🏔️ BOARD STATE:");
  board.steps.forEach((step, rowIndex) => {
    const row = step.slots.map((slot) => (slot.tile ? "🔷" : "⬜")).join(" ");
    console.log(`  Row ${rowIndex + 1}: ${row}`);
  });
}

function printResourcesChange(player: Player, before: Record<string, number>) {
  console.log("\n💰 RESOURCE CHANGES:");
  for (const resource of ALL_RESOURCES) {
    const oldAmount = before[resource] || 0;
    const newAmount = player.getResource(resource);
    const change = newAmount - oldAmount;
    if (change > 0) {
      console.log(`  ${resource}: ${oldAmount} → ${newAmount} (+${change})`);
    } else {
      console.log(`  ${resource}: ${oldAmount} (no change)`);
    }
  }
}

function simulateActionPlaceActivation() {
  console.log("🎮 SIMULATING ACTION PLACE ACTIVATION");
  console.log("=====================================\n");

  const board = new PlayerBoard(PlayerColor.BLUE);
  const player = new Player("Dani", board, []);

  const worker = new Worker(player);

  console.log("📋 SETUP PHASE:");
  console.log("- Created player board with 3 steps (7 slots each)");
  console.log("- Generated random tiles to place");

  // Generate some tiles and place them strategically
  const tiles = Array.from({ length: 6 }, () => generateRandomTile());

  // Place tiles in a pattern that will create interesting water flow
  console.log("\n🔷 PLACING TILES:");

  // Step 1: Place 3 tiles (water will flow to slot 3)
  board.steps[0].slots[0].tile = tiles[0];
  board.steps[0].slots[1].tile = tiles[1];
  board.steps[0].slots[2].tile = tiles[2];
  console.log("  Step 1: Placed tiles in slots 1, 2, 3");

  // Step 2: Place 2 tiles starting from slot 4 (water flows from slot 3)
  board.steps[1].slots[3].tile = tiles[3];
  board.steps[1].slots[4].tile = tiles[4];
  console.log("  Step 2: Placed tiles in slots 4, 5");

  // Step 3: Place 1 tile at slot 5 (water flows from slot 5)
  board.steps[2].slots[5].tile = tiles[5];
  console.log("  Step 3: Placed tile in slot 6");

  printBoardState(board);

  console.log("\n📊 PLACED TILES PRODUCTION:");
  tiles.forEach((tile, i) => {
    console.log(
      `  Tile ${i + 1}: ${tile.production
        .map((r) => `${r[1]}x ${r[0]}`)
        .join(", ")}`
    );
  });

  const resourcesBefore: Record<string, number> = {};
  for (const resource of ALL_RESOURCES) {
    resourcesBefore[resource] = player.getResource(resource);
  }

  console.log("\n⚡ ACTIVATING PRODUCTION ACTION PLACE:");
  console.log("- Placing worker on production action place");
  console.log("- This will trigger water cascade production");

  try {
    PRODUCTION_PLACE.placeWorkers([worker]);
    PRODUCTION_PLACE.execute(player, [worker], {} as Game);

    console.log("✅ Production action executed successfully!");

    const resourcesAfter: Record<string, number> = {};
    for (const resource of ALL_RESOURCES) {
      resourcesAfter[resource] = player.getResource(resource);
    }

    console.log("\n🌊 WATER CASCADE SIMULATION:");
    console.log("  Water flow path:");
    console.log(
      "    Row 1: ⬇️ Slots 1→2→3 (tiles activated) → falls to Row 2, Column 4"
    );
    console.log(
      "    Row 2: ⬇️ Slots 4→5 (tiles activated) → falls to Row 3, Column 6"
    );
    console.log("    Row 3: ⬇️ Slot 6 (tile activated) → water ends");

    console.log("\n💧 WATER CUBES ADDED:");
    let activatedTileCount = 0;
    board.steps.forEach((step, stepIndex) => {
      step.slots.forEach((slot, slotIndex) => {
        if (slot.tile && slot.tile.waterCubes > 0) {
          activatedTileCount++;
          console.log(
            `  Step ${stepIndex + 1}, Slot ${slotIndex + 1}: ${
              slot.tile.waterCubes
            } water cube(s)`
          );
        }
      });
    });

    printResourcesChange(player, resourcesBefore);

    console.log(
      `\n📈 SUMMARY: ${activatedTileCount} tiles were activated by the water cascade!`
    );
  } catch (error) {
    console.error("❌ Error during production:", (error as Error).message);
  }
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  simulateActionPlaceActivation();
}
