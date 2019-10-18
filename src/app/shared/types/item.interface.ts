import { Stats } from "./stats.interface";
import { Icon } from "./icon.interface";

export interface Item {
    stackable: boolean,
    hasDurability: boolean,
    amount: boolean,
    name: string,
    lore: string,
    stats: Stats,
    icon: Icon
}