import { Item } from "./item.interface";

export interface Inventory{
    items: Array<Item>,
    helmet: Item,
    chestplate: Item,
    leggings: Item,
    boots: Item,
    mainHand: Item,
    offHand: Item
}