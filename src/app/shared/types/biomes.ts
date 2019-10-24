export function getBiome(value) {
    let biome = 'plains';
    if (value < .15) biome = 'forest';
    else biome = 'plains';
    return biome;
}

export function getTile(num, biome) {
    let tile;
    if (biome == 'forest') {
        tile = 'tree';
    }
    else {
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
        return true;
    }
    else {
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