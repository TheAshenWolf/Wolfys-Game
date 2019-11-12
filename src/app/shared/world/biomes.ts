import * as entity from '../entities/entities';

export function getBiome(value) {
    let biome = 'plains';
    if (value < .5) biome = 'forest';
    else biome = 'plains';
    return biome;
}

export function entities(biome) {
    switch (biome) {
        case 'forest':
            return [{entity: entity.Bunny, chance: 0.5, behavior: 'shy'}];
        default: // plains
            return [{entity: entity.Bunny, chance: 0.75, behavior: 'shy'}];      
    }
}

export function getTile(num, biome) {
    let tile = {tile: 'grass1', safe: true};
    if (biome == 'forest') {
        if (num < 0.02) tile = {tile: 'lake', safe: false};
        else if (num < 0.06) tile = {tile: 'stump', safe: false};
        else if (num < 0.09) tile = {tile: 'herbRed', safe: true};
        else if (num < 0.12) tile = {tile: 'herbBlue', safe: true};
        else if (num < 0.27) tile = {tile: 'grass1', safe: true};
        else if (num < 0.42) tile = {tile: 'grass2', safe: true};
        else if (num < 0.57) tile = {tile: 'grass3', safe: true};
        else if (num < 0.6) tile = {tile: 'rock', safe: false};
        else if (num < 0.97) tile = {tile: 'tree', safe: false};
        else tile = {tile: 'thorns', safe: true};
    }
    else { // plains
        if (num < 0.05) tile = {tile: 'lake', safe: false};
        else if (num < 0.1) tile = {tile: 'stump', safe: false};
        else if (num < 0.13) tile = {tile: 'herbRed', safe: true};
        else if (num < 0.36) tile = {tile: 'grass1', safe: true};
        else if (num < 0.62) tile = {tile: 'grass2', safe: true};
        else if (num < 0.80) tile = {tile: 'grass3', safe: true};
        else if (num < 0.9) tile = {tile: 'rock', safe: false};
        else tile = {tile: 'tree', safe: false};
    }
    return tile;
}