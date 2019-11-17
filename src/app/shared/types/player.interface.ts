import { Inventory } from './inventory.interface';

export interface Player {
    inventory: Inventory,
    stats: {
        health: {
            max: number,
            current: number
        },
        mana: {
            max: number,
            current: number,
        },
        experience: {
            total: number,
            forNextLevel: number,
            nextLevelExp: number,
            level: number
        }
    },
    rotation: 'front' | 'left' | 'right' | 'back'
}