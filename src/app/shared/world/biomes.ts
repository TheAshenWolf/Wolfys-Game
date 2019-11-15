import Entities from '../entities/entities';
import { Tile } from '../types/tile.interface';

export function getBiome(value): string {
    let biome = 'plains';
    if (value < .15) biome = 'desert';
    if (value < .45) biome = 'plains';
    if (value < .75) biome = 'forest';
    if (value < .85) biome = 'taiga';
    else biome = 'tundra';
    return biome;
}

export function entities(biome) {
    switch (biome) {
        case 'forest':
            return [{entity: 'bunny', chance: 0.5, behavior: 'shy'}];
        default: // plains
            return [{entity: 'bunny', chance: 0.75, behavior: 'shy'}];      
    }
}

export function getTile(num, biome) {
    let tile: Tile = {tile: 'grass1', safe: true};
    if (biome === 'forest') {
        if (num < 0.02) tile = {tile: 'lake', safe: false};
        else if (num < 0.06) tile = {tile: 'stump', safe: false};
        else if (num < 0.09) tile = {tile: 'herbRed', safe: true};
        else if (num < 0.12) tile = {tile: 'herbBlue', safe: true};
        else if (num < 0.27) tile = {tile: 'grass1', safe: true};
        else if (num < 0.42) tile = {tile: 'grass2', safe: true};
        else if (num < 0.57) tile = {tile: 'grass3', safe: true};
        else if (num < 0.6) tile = {tile: 'rock', safe: false};
        else if (num < 0.97) tile = {tile: 'tree', safe: false};
        else tile = {tile: 'thorns', safe: true, harming: true};
    }
    else if (biome === 'desert') {
        if (num < 0.02) tile = {tile: 'rock', safe: false};
        else if (num < 0.32) tile = {tile: 'sand1', safe: true};
        else if (num < 0.62) tile = {tile: 'sand2', safe: true};
        else if (num < 0.65) tile = {tile: 'smallRocks', safe: true}
        else if (num < 0.95) tile = {tile: 'sand3', safe: true};
        else tile = {tile: 'cactus', safe: false, harming: true};
    }
    else if (biome === 'taiga') {
        if (num < 0.02) tile = {tile: 'treeSnow', safe: false};
        else if (num < 0.27) tile = {tile: 'snow1', safe: true};
        else if (num < 0.52) tile = {tile: 'snow2', safe: true};
        else if (num < 0.77) tile = {tile: 'snow3', safe: true};
        else tile = {tile: 'pineSnow', safe: false};
    }
    else if (biome === 'tundra') {
        if (num < 0.32) tile = {tile: 'snow1', safe: true};
        else if (num < 0.65) tile = {tile: 'snow2', safe: true};
        else if (num < 0.98) tile = {tile: 'snow3', safe: true};
        else tile = {tile: 'pineSnow', safe: false};
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