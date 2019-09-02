import { Inventory } from "./inventory.interface";
import { Stats } from "./stats.interface";

export interface Player{
    inventory: Inventory,
    stats: Stats,
    level: number,
    xp: number
}