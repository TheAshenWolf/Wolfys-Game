import { Item } from "./item.interface";

export interface LootTable{
    items: Array<{
        item: Item,
        chance: number
    }>
}