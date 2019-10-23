import { Stats } from "./stats.interface";
import { Icon } from "./icon.interface";

export interface Item {
    amount: boolean,
    name: string,
    description: string,
    stats: Stats,
    icon: Icon
}