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
    let tile;
    if (biome == 'forest') {
        if (num < 0.02) tile = 'lake';
        else if (num < 0.06) tile = 'stump';
        else if (num < 0.09) tile = 'herbRed';
        else if (num < 0.12) tile = 'herbBlue';
        else if (num < 0.27) tile = 'grass1';
        else if (num < 0.42) tile = 'grass2';
        else if (num < 0.57) tile = 'grass3';
        else if (num < 0.6) tile = 'rock';
        else if (num < 0.97) tile = 'tree';
        else tile = 'thorns';
    }
    else { // plains
        if (num < 0.05) tile = 'lake';
        else if (num < 0.1) tile = 'stump';
        else if (num < 0.13) tile = 'herbRed';
        else if (num < 0.36) tile = 'grass1';
        else if (num < 0.62) tile = 'grass2';
        else if (num < 0.80) tile = 'grass3';
        else if (num < 0.9) tile = 'rock';
        else tile = 'tree';
    }
    return tile;
}

export function getSafeTile(num, biome) {
    if (biome == 'forest') {
        if (num < 0.02) return false;
        else if (num < 0.06) return false;
        else if (num < 0.09) return true;
        else if (num < 0.12) return true;
        else if (num < 0.27) return true;
        else if (num < 0.42) return true;
        else if (num < 0.57) return true;
        else if (num < 0.6) return false;
        else if (num < 0.97) return false;
        else return true;
    }
    else { // plains
        if (num < 0.05) return false;
        else if (num < 0.1) return false;
        else if (num < 0.13) return true;
        else if (num < 0.36) return true;
        else if (num < 0.62) return true;
        else if (num < 0.80) return true;
        else if (num < 0.9) return false;
        else return false;
    }
}