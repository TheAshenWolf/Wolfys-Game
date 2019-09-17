const SimplexNoise = require('simplex-noise')

export default class worldgen {

    worldName = 'World';
    worldSeed = 0;

    constructor (name, seed) {
        this.worldName = worldName;
        this.worldSeed = worldSeed;
    }

    simplex = new SimplexNoise(this.worldSeed)
    value2d = simplex(0, 0);
    log(value2d);
    

    log(){
        console.log(value2d);
    }
}