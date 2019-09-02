import { Stats } from "./stats.interface";
import { LootTable } from "./loottable.interface";

export interface Monster{
    healthMultiplier: number,
    stats: Stats,
    drops: LootTable,
    armor: number
}