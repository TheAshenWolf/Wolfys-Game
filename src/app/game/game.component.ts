import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { SOM, SubscriptionObject } from '../som/SubscriptionObject';
import * as SimplexNoise from 'simplex-noise';
import * as Biomes from '../shared/world/biomes';
import Items from '../shared/player/items';
import { environment } from 'src/environments/environment';
import { fireball } from '../shared/spells/fireball';
import { World } from '../shared/types/world.interface';
import { setInterval, setTimeout } from 'timers';
import { Tile } from '../shared/types/tile.interface';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    @ViewChild('args', { static: true }) commandLine: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    @ViewChild('grass1', { static: true }) tileGrass1: ElementRef;
    @ViewChild('grass2', { static: true }) tileGrass2: ElementRef;
    @ViewChild('grass3', { static: true }) tileGrass3: ElementRef;
    @ViewChild('tree', { static: true }) tileTree: ElementRef;
    @ViewChild('stump', { static: true }) tileStump: ElementRef;
    @ViewChild('rock', { static: true }) tileRock: ElementRef;
    @ViewChild('lake', { static: true }) tileLake: ElementRef;
    @ViewChild('herbRed', { static: true }) tileHerbRed: ElementRef;
    @ViewChild('herbBlue', { static: true }) tileHerbBlue: ElementRef;
    @ViewChild('herbCollected', { static: true }) tileHerbCollected: ElementRef;
    @ViewChild('thorns', { static: true }) tileThorns: ElementRef;
    @ViewChild('ash', { static: true }) tileAsh: ElementRef;

    @HostListener('document:keypress', ['$event'])
    movement(event: KeyboardEvent): void {
        if (this.commandLine.nativeElement !== document.activeElement) {
            if (event.key === 'w') {
                this.world.player.rotation = 'back';
                this.characterSrc = environment.component + 'character/back.png';
                let y = this.world.relativePosY <= 0 ? this.world.tileset.tilesetY - 1 : this.world.tileset.tilesetY;
                if (this.safeTile(this.world.posX, this.world.posY - 1, Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, y) + 1) / 2))) {
                    this.world.posY = this.world.posY - 1;

                    let num = (this.pattern.noise2D(this.world.posX, this.world.posY) + 1) / 2;
                    let biome = Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, y) + 1) / 2)
                    this.harmTile(num, biome);
                    if (this.world.relativePosY <= 0) {
                        this.world.tileset.tilesetY = this.world.tileset.tilesetY - 1;
                        this.world.relativePosY = this.amountYTiles - 1;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 's') {
                this.world.player.rotation = 'front';
                let y = this.world.relativePosY >= this.amountYTiles - 1 ? this.world.tileset.tilesetY + 1 : this.world.tileset.tilesetY;
                this.characterSrc = environment.component + 'character/front.png';
                if (this.safeTile(this.world.posX, this.world.posY + 1, Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, y) + 1) / 2))) {
                    this.world.posY = this.world.posY + 1;

                    let num = (this.pattern.noise2D(this.world.posX, this.world.posY) + 1) / 2;
                    let biome = Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, y) + 1) / 2)
                    this.harmTile(num, biome);
                    if (this.world.relativePosY >= this.amountYTiles - 1) {
                        this.world.tileset.tilesetY = this.world.tileset.tilesetY + 1;
                        this.world.relativePosY = 0;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 'a') {
                this.world.player.rotation = 'left';
                if (this.step) {
                    this.characterSrc = environment.component + 'character/left-1.png';
                } else {
                    this.characterSrc = environment.component + 'character/left-2.png';
                }
                this.step = !this.step;
                let x = this.world.relativePosX <= 0 ? this.world.tileset.tilesetX - 1 : this.world.tileset.tilesetX;
                if (this.safeTile(this.world.posX - 1, this.world.posY, Biomes.getBiome((this.pattern.noise2D(x, this.world.tileset.tilesetY) + 1) / 2))) {
                    this.world.posX = this.world.posX - 1;

                    let num = (this.pattern.noise2D(this.world.posX, this.world.posY) + 1) / 2;
                    let biome = Biomes.getBiome((this.pattern.noise2D(x, this.world.tileset.tilesetY) + 1) / 2)
                    this.harmTile(num, biome);
                    if (this.world.relativePosX <= 0) {
                        this.world.tileset.tilesetX = this.world.tileset.tilesetX - 1;
                        this.world.relativePosX = this.amountXTiles - 1;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 'd') {
                this.world.player.rotation = 'right';
                if (this.step) {
                    this.characterSrc = environment.component + 'character/right-1.png';
                } else {
                    this.characterSrc = environment.component + 'character/right-2.png';
                }
                this.step = !this.step;

                let x = this.world.relativePosX >= this.amountXTiles - 1 ? this.world.tileset.tilesetX + 1 : this.world.tileset.tilesetX;
                if (this.safeTile(this.world.posX + 1, this.world.posY, Biomes.getBiome((this.pattern.noise2D(x, this.world.tileset.tilesetY) + 1) / 2))) {
                    this.world.posX = this.world.posX + 1;

                    let num = (this.pattern.noise2D(this.world.posX, this.world.posY) + 1) / 2;
                    let biome = Biomes.getBiome((this.pattern.noise2D(x, this.world.tileset.tilesetY) + 1) / 2)
                    this.harmTile(num, biome);
                    if (this.world.relativePosX >= this.amountXTiles - 1) {
                        this.world.tileset.tilesetX = this.world.tileset.tilesetX + 1;
                        this.world.relativePosX = 0;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === ' ') {
                this.action();
            }
            else if (event.key === 'f') {
                if (this.cooldown === undefined) {
                    this.cooldown = setTimeout(() => {
                        this.cast(fireball);
                        clearTimeout(this.cooldown);
                        this.cooldown = undefined;
                    }, 250);
                }
            }
            event.stopPropagation();
            this.setCharacterPos();
            event.preventDefault();
        }
    }
    env: Object;
    context: any;
    pattern: SimplexNoise;
    subscription: SubscriptionObject = {};
    consoleLog: string = ``;
    creatingWorld: boolean = false;
    amountXTiles: number = 31;
    amountYTiles: number = 21;
    tileSizePixels: number = 24;
    canvasWidth: number = this.amountXTiles * this.tileSizePixels;
    canvasHeight: number = this.amountYTiles * this.tileSizePixels;
    world: World = {
        seed: null,
        name: 'world',
        posX: 15,
        posY: 10,
        relativePosX: 15,
        relativePosY: 10,
        tileset: {
            tilesetX: 0,
            tilesetY: 0,
            biome: 'plains',
            spells: [],
            entities: []
        },
        overrides: {
            //tilex: tiley: x: y:{tile:tile, safe:bool}
        },
        spawnPointX: 15,
        spawnPointY: 10,
        player: {
            inventory: {
                items: {
                }
            },
            stats: {
                health: {
                    max: 100,
                    current: 100
                },
                mana: {
                    max: 50,
                    current: 50,
                },
                experience: {
                    total: 0,
                    forNextLevel: 0,
                    nextLevelExp: 100,
                    level: 1
                }
            },
            rotation: 'front'
        }
    }
    cooldown: any;
    tiles = {};
    characterSrc = environment.component + 'character/front.png';
    characterPos = {
        position: 'absolute',
        left: (this.world.posX * this.tileSizePixels + this.tileSizePixels / 3 * 2) + 'px',
        top: (this.world.posY * this.tileSizePixels + this.tileSizePixels / 3 * 2 + 1) + 'px'
    };
    baseHealth = 100;
    baseMana = 50;
    step: boolean = true;
    loadingWorld: boolean = false;
    entityBehavior = {
        shy: (entity, index) => {
            let interval = 1500;
            let direction = {x: 0, y: 0};
            this.world.tileset.entities[index].life = setInterval(
                () => {
                    if(this.distance(this.world.relativePosX, this.world.relativePosY, entity.x, entity.y) <= entity.visionRadius) {
                        let distX = Math.abs(this.world.relativePosX - entity.x);
                        let distY = Math.abs(this.world.relativePosY - entity.y);
                            direction.x = Math.sign(entity.x - this.world.relativePosX);
                            direction.y = Math.sign(entity.y - this.world.relativePosY);
                            if (direction.x < 0) {
                                entity.rotation = 'left';
                            }
                            else {
                                entity.rotation = 'right';
                            }
                            if (direction.y < 0) {
                                entity.rotation = 'back';
                            }
                            else {
                                entity.rotation = 'front';
                            }
                        }
                        
                    else {
                        let dir = Math.floor(Math.random() *4);
                        const directionArray = [{x: 1, y: 0},{x: -1, y: 0},{x: 0, y: 1},{x: 0, y: -1}];
                        const rotationArray = ['right', 'left', 'front', 'back'];
                        direction = directionArray[dir];
                        entity.rotation = rotationArray[dir];
                    }

                    let tries = 0;
                    while (!this.safeTile(entity.x + this.world.tileset.tilesetX * this.amountXTiles + direction.x, entity.y + this.world.tileset.tilesetY * this.amountYTiles + direction.y, this.world.tileset.biome) && tries < 8) {
                        tries++;
                        let dir = Math.floor(Math.random() *4);
                        const directionArray = [{x: 1, y: 0},{x: -1, y: 0},{x: 0, y: 1},{x: 0, y: -1}];
                        const rotationArray = ['right', 'left', 'front', 'back'];
                        direction = directionArray[dir];
                        entity.rotation = rotationArray[dir];
                    }

                    if( tries >= 8) {
                        entity.health = 0;
                    }
                    else {
                        entity.x += direction.x;
                        entity.y += direction.y;
                    }
                    
                    let coordX = entity.x * this.tileSizePixels;
                    let coordY = entity.y * this.tileSizePixels;

                    if(entity.x < 0 || entity.y < 0 || entity.x >= this.amountXTiles || entity.y >= this.amountYTiles) {
                        entity.health = 0;
                    }
                    else {
                        this.world.tileset.entities[index].src = entity.src + entity.rotation + entity.fileType;
                        this.world.tileset.entities[index].position = {
                            position: 'absolute',
                            left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                            top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
                        }
                    }    
                    
                    if(entity.health <= 0) {
                        clearInterval(this.world.tileset.entities[index].life);
                        this.world.tileset.entities[index].position = {
                            position: 'absolute',
                            left: '0px',
                            top: '0px',
                            display: 'none'
                        };
                    }
                }, interval); 
            
        },
        sleeping: () => {
            // staying on a place, until player attacks, then changes to either shy or aggressive
        },
        careless: () => {
            // casually moving around unless attacked, does not mind the player
        },
        aggressive: () => {
            // attacks the player
        }
    }

    constructor() { }

    ngOnInit(): void {
        this.env = environment;
    }

    public submit() {
        this.log('woof?');
    }

    public startWorldCreation() {
        if (!this.creatingWorld) {
            this.log('Please, write in the world name and the seed. The seed may be empty for a random one.');
            this.log('Example: [name] [seed]');
        }
        this.creatingWorld = true;
    }

    public worldCreation(name, seed, event): void {
        if ((name && name.length > 2)) {
            if (seed === undefined || seed === null || seed === '') {
                seed = Math.floor(Math.random() * 10000000);
            }
            this.creatingWorld = false;
            this.log('Started world creation process...');
            this.log('World Name: ' + name);
            this.log('World Seed: ' + seed);

            this.world.name = name;
            this.world.seed = seed;
            this.world.posX = 15,
                this.world.posY = 10,
                this.world.tileset.tilesetX = 0,
                this.world.tileset.tilesetY = 0,
                this.world.relativePosX = 15,
                this.world.relativePosY = 10


            this.generateMap();
            this.setDefaultCharacterStats();
            this.setCharacterPos();
            this.log('World created');
        }
        else {
            this.log('World name must be at least 3 characters long!');
        }

        if (event) event.stopPropagation();

    }

    public saveWorld() {
        //fs.writeFileSync(environment.component + '' + this.world.name + '.json', JSON.stringify(this.world));
        if (this.world.seed) {
            //this.clearMemory();
            this.log(JSON.stringify(this.world));
            this.log('Please, save this somewhere:');
        }
        else {
            this.error('There is no world to save!');
        }
    }

    public startWorldLoading() {
        this.log('Please, paste your saved link and hit run.');
        this.loadingWorld = true;
    }

    public loadWorld(str) {
        this.log('Loading world...');
        try {
            this.world = JSON.parse(str.trim());
            this.world.tileset.spells = [];
            this.setCharacterPos();
            this.generateMap();
            this.loadingWorld = false;
            this.log('World loaded.');
        }
        catch {
            this.loadingWorld = false;
            this.log('World could not be loaded.');
        }
    }

    public command(argstr: string): void {
        if (argstr !== '') {
            const args = argstr.split(' ');
            this.log(argstr);
            if (this.creatingWorld) {
                let name = args[0];
                let seed = args[1];
                this.worldCreation(name, (seed || undefined), undefined);
            }
            else if (this.loadingWorld) {
                this.loadWorld(argstr);
            }
            else {
                switch (args[0]) {
                    case 'clear': // Clears the console
                        this.consoleLog = '';
                        break;
                    case 'createworld': // Creates world with give name and (optional) seed
                        let name = args[1];
                        let seed = args[2];
                        this.worldCreation(name, (seed || undefined), undefined);
                        break;
                    case 'givexp':
                        this.addExperience(+args[1]);
                        break;
                    case 'suicide':
                        this.death();
                        break;
                    case 'givehp':
                        this.addHealth(+args[1]);
                        break;
                    case 'givemp':
                        this.addMana(+args[1]);
                        break;
                    case 'fillhp':
                        this.addHealth(this.world.player.stats.health.max);
                        break;
                    case 'fillmp':
                        this.addMana(this.world.player.stats.mana.max);
                        break;
                    case 'tp':
                        if(!isNaN(+args[1]) && ! isNaN(+args[2])) {
                            this.world.posX = +args[1];
                            this.world.posY = +args[2];
                            this.world.tileset.tilesetX = Math.floor(this.world.posX / this.amountXTiles);
                            this.world.tileset.tilesetY = Math.floor(this.world.posY / this.amountYTiles);
                            this.generateMap();
                            this.setCharacterPos();
                        }
                        else{
                            this.log('These coordinates will not work.');
                        }
                        break;
                }
            }
        }
        this.commandLine.nativeElement.value = '';
    }

    public getItems() {
        return Object.keys(this.world.player.inventory.items);
    }

    public setCharacterPos() {
        this.world.relativePosX = (this.world.posX - this.world.tileset.tilesetX * this.amountXTiles);
        this.world.relativePosY = (this.world.posY - this.world.tileset.tilesetY * this.amountYTiles);
        let coordX = this.world.relativePosX * this.tileSizePixels;
        let coordY = this.world.relativePosY * this.tileSizePixels;
        this.characterPos.left = coordX + this.tileSizePixels / 3 * 2 + 'px';
        this.characterPos.top = coordY + this.tileSizePixels / 3 * 2 + 1 + 'px';
    }

    public log(message): void {
        this.consoleLog = `[${new Date().toLocaleTimeString()}] > ${message} <br>` + this.consoleLog;
    }

    public error(message): void {
        this.consoleLog = `[${new Date().toLocaleTimeString()}] ! > ${message} <br>` + this.consoleLog;
    }

    public safeTile(x: number, y: number, biome = this.world.tileset.biome): boolean {
        let relX = x - this.world.tileset.tilesetX * this.amountXTiles;
        let relY = y - this.world.tileset.tilesetY * this.amountYTiles;
        if (this.world.overrides[this.world.tileset.tilesetX] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][relX.toString()] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][relX.toString()][relY.toString()]) {
            return this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][relX.toString()][relY.toString()].safe;
        }
        return Biomes.getTile((this.pattern.noise2D(x, y) + 1) / 2, biome).safe;
    }

    public generateMap() {
        this.context = this.canvas.nativeElement.getContext('2d');

        this.pattern = new SimplexNoise(this.world.seed.toString());
        this.world.tileset.biome = Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, this.world.tileset.tilesetY) + 1) / 2);

        if (this.world.overrides[this.world.tileset.tilesetX] === undefined) {
            this.world.overrides[this.world.tileset.tilesetX] = {};
        }
        if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] === undefined) {
            this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] = {};
        }

        this.setTiles();
        this.clearMemory();

        Biomes.entities(this.world.tileset.biome).forEach((entity) => {
            if (Math.random() > entity.chance) {
                this.spawnEntity(entity.entity, this.entityBehavior[entity.behavior]);
            }
        });
        for (let x = 0; x < this.amountXTiles; x++) {
            for (let y = 0; y < this.amountYTiles; y++) {
                let num = (this.pattern.noise2D(x + this.world.tileset.tilesetX * this.amountXTiles, y + this.world.tileset.tilesetY * this.amountYTiles) + 1) / 2;

                let tile;
                if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()]) {
                    tile = this.tiles[this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()].tile];
                }
                else {
                    tile = this.tiles[Biomes.getTile(num, this.world.tileset.biome).tile];
                }
                this.context.drawImage(tile, x * this.tileSizePixels, y * this.tileSizePixels);
            }
        }
    }

    public action() {
        let x = this.world.relativePosX;
        let y = this.world.relativePosY;

        if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()]) {
            return null;
        }
        else {
            let tileNum = (this.pattern.noise2D(x + this.world.tileset.tilesetX * this.amountXTiles, y + this.world.tileset.tilesetY * this.amountYTiles) + 1) / 2;
            let tile = Biomes.getTile(tileNum, this.world.tileset.biome).tile;
            if (tile == 'herbRed' || tile == 'herbBlue') {
                if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] === undefined) {
                    this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] = {};
                }
                this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()] = { tile: 'herbCollected', safe: true };
                this.addToInventory(tile);
                this.addExperience(5);
            }
            else {
                return null;
            }
            this.context.drawImage(this.tiles[this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()].tile], x * this.tileSizePixels, y * this.tileSizePixels);

        }
    }

    private setTiles() {
        this.tiles = {
            lake: this.tileLake.nativeElement,
            stump: this.tileStump.nativeElement,
            herbRed: this.tileHerbRed.nativeElement,
            grass1: this.tileGrass1.nativeElement,
            grass2: this.tileGrass2.nativeElement,
            grass3: this.tileGrass3.nativeElement,
            rock: this.tileRock.nativeElement,
            tree: this.tileTree.nativeElement,
            herbCollected: this.tileHerbCollected.nativeElement,
            herbBlue: this.tileHerbBlue.nativeElement,
            thorns: this.tileThorns.nativeElement,
            cactus: null,
            sand1: null,
            sand2: null,
            sand3: null,
            ash: this.tileAsh.nativeElement
        }
    }

    private addToInventory(item) {
        if (this.world.player.inventory.items[item]) {
            if (this.world.player.inventory.items[item].quantity < 1000) {
                this.world.player.inventory.items[item].quantity += 1;
            }
        }
        else {
            this.world.player.inventory.items[item] = Items[item];
            this.world.player.inventory.items[item].quantity = 1;
        }
    }

    public getHealthFill() {
        let value = ((this.world.player.stats.health.current / this.world.player.stats.health.max) * 100);
        if (value == 100) {
            return { 'background-color': '#f00' };
        }
        else {
            let obj = 'linear-gradient(to right, #f00, #f00 ' + value + '%, #aaa ' + value + '%, #aaa 100%)';
            return { 'background-image': obj };
        }
    }

    public getManaFill() {
        let value = ((this.world.player.stats.mana.current / this.world.player.stats.mana.max) * 100);
        if (value == 100) {
            return { 'background-color': '#00f' };
        }
        else {
            let obj = 'linear-gradient(to right, #00f, #00f ' + value + '%, #aaa ' + value + '%, #aaa 100%)';
            return { 'background-image': obj };
        }
    }

    public getExpFill() {
        let value = ((this.world.player.stats.experience.forNextLevel / this.world.player.stats.experience.nextLevelExp) * 100);
        if (value == 100) {
            return { 'background-color': '#ff0' };
        }
        else {
            let obj = 'linear-gradient(to right, #ff0, #ff0 ' + value + '%, #aaa ' + value + '%, #aaa 100%)';
            return { 'background-image': obj };
        }
    }

    public addExperience(amount) {
        this.world.player.stats.experience.total += amount;
        let oldLevel = this.world.player.stats.experience.level;
        if ((this.world.player.stats.experience.level < 100) || (amount < 0)) {
            this.world.player.stats.experience.level = Math.floor(this.world.player.stats.experience.total / 100) + 1;
            if (this.world.player.stats.experience.level != oldLevel) {
                this.levelStatBoost();
            }
        }


        this.world.player.stats.experience.forNextLevel = this.world.player.stats.experience.total - (this.world.player.stats.experience.level - 1) * 100;
    }

    private setDefaultCharacterStats() {
        this.world.player = {
            inventory: {
                items: {
                }
            },
            stats: {
                health: {
                    max: 100,
                    current: 100
                },
                mana: {
                    max: 50,
                    current: 50,
                },
                experience: {
                    total: 0,
                    forNextLevel: 0,
                    nextLevelExp: 100,
                    level: 1
                }
            },
            rotation: 'front'
        }
    }

    public death() {
        if (this.world.player.stats.experience.total > 24) {
            this.addExperience(-25);
        }
        else {
            this.world.player.stats.experience.total = 0;
        }
        this.characterSrc = environment.component + 'character/rip.png';
        this.world.player.stats.health.current = this.world.player.stats.health.max;
        this.world.player.stats.mana.current = this.world.player.stats.mana.max;
        this.world.posX = this.world.spawnPointX;
        this.world.posY = this.world.spawnPointY;
        this.world.tileset.tilesetX = 0;
        this.world.tileset.tilesetY = 0;
        this.setCharacterPos();
        this.context = this.canvas.nativeElement.getContext('2d');
        this.context.fillStyle = '#ddd';
        this.context.fillRect(0, 0, this.amountXTiles * this.tileSizePixels, this.amountYTiles * this.tileSizePixels);
        this.log('You died! You will respawn within 5 seconds.');
        let timeout = setTimeout(() => {
            this.respawn();
            clearTimeout(timeout);
        }, 5000);
    }

    public respawn() {
        this.characterSrc = environment.component + 'character/front.png';
        this.generateMap();
    }

    public addHealth(amount) {
        let hp = this.world.player.stats.health.current + amount;
        if (hp > this.world.player.stats.health.max) {
            this.world.player.stats.health.current = this.world.player.stats.health.max;
        } else if (hp <= 0) {
            this.death();
        } else {
            this.world.player.stats.health.current = Math.floor(hp);
        }
    }

    public addMana(amount) {
        let mp = this.world.player.stats.mana.current + amount;
        if (mp > this.world.player.stats.mana.max) {
            this.world.player.stats.mana.current = this.world.player.stats.mana.max;
        } else if (mp <= 0) {
            this.world.player.stats.mana.current = 0;
        } else {
            this.world.player.stats.mana.current = Math.floor(mp);
        }
    }

    public levelStatBoost() {
        let newHP = this.baseHealth * Math.pow(1.1, this.world.player.stats.experience.level - 1);
        this.world.player.stats.health.max = Math.floor(newHP);
        let newMP = this.baseMana * Math.pow(1.1, this.world.player.stats.experience.level - 1);
        this.world.player.stats.mana.max = Math.floor(newMP);
    }

    public useItem(item) {
        let itemUsed = false;
        switch (item) {
            case 'herbRed':
                if (this.world.player.stats.health.current == this.world.player.stats.health.max) {
                    this.log('Your health is full!');
                }
                else {
                    this.addHealth(Math.floor(this.world.player.stats.health.max * 0.1));
                    itemUsed = true;
                }
                break;
            case 'herbBlue':
                if (this.world.player.stats.mana.current == this.world.player.stats.mana.max) {
                    this.log('Your mana is full!');
                }
                else {
                    this.addMana(Math.floor(this.world.player.stats.mana.max * 0.1));
                    itemUsed = true;
                }
                break;
        }
        if (itemUsed) {
            this.world.player.inventory.items[item].quantity -= 1;
            if (this.world.player.inventory.items[item].quantity <= 0) {
                delete this.world.player.inventory.items[item];
            }
        }
    }

    public cast(spell) {
        if (this.world.player.stats.mana.current >= spell.cost) {
            this.addMana(-spell.cost);
            if (spell.type == 'projectile') {
                let spellPosX = (this.world.posX - this.world.tileset.tilesetX * this.amountXTiles);
                let spellPosY = (this.world.posY - this.world.tileset.tilesetY * this.amountYTiles);
                let coordX = spellPosX * this.tileSizePixels;
                let coordY = spellPosY * this.tileSizePixels;

                let direction = { x: 0, y: 0 };
                switch (this.world.player.rotation) {
                    case 'front':
                        direction.y = 1;
                        break;
                    case 'back':
                        direction.y = -1;
                        break;
                    case 'left':
                        direction.x = -1;
                        break;
                    case 'right':
                        direction.x = 1;
                        break;
                }
                let index = this.world.tileset.spells.length;
                this.world.tileset.spells.push({
                    src: spell.src + this.world.player.rotation + spell.fileType,
                    position: {
                        position: 'absolute',
                        left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                        top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
                    }
                });
                this.world.tileset.spells[index].life = setInterval(() => {
                    spellPosX += direction.x;
                    spellPosY += direction.y;
                    coordX = spellPosX * this.tileSizePixels;
                    coordY = spellPosY * this.tileSizePixels;
                    let num = (this.pattern.noise2D(spellPosX + this.amountXTiles * this.world.tileset.tilesetX, spellPosY + this.amountYTiles * this.world.tileset.tilesetY) + 1) / 2;
                    let safeTile;
                    if (this.world.overrides[this.world.tileset.tilesetX] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX][spellPosY]) {
                        safeTile = this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX][spellPosY].safe;
                    }
                    else {
                        safeTile = Biomes.getTile(num, this.world.tileset.biome).safe;
                    }
                    if (spellPosX < 0 || spellPosX >= this.amountXTiles || spellPosY < 0 || spellPosY >= this.amountYTiles || !(safeTile)) {
                        clearInterval(this.world.tileset.spells[index].life);
                        this.world.tileset.spells[index].src = spell.endSrc + this.world.player.rotation + spell.fileType;
                        setTimeout(() => {
                            this.world.tileset.spells[index].position = {
                                position: 'absolute',
                                left: '0px',
                                top: '0px',
                                display: 'none'
                            };
                        }, 250);
                        if (!(Biomes.getTile(num, this.world.tileset.biome)).safe && !(spellPosX < 0 || spellPosX >= this.amountXTiles || spellPosY < 0 || spellPosY >= this.amountYTiles)) {
                            if (this.world.overrides[this.world.tileset.tilesetX] === undefined) {
                                this.world.overrides[this.world.tileset.tilesetX] = {};
                            }
                            if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] === undefined) {
                                this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] = {};
                            }
                            if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX] === undefined) {
                                this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX] = {}
                            }
                            this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX][spellPosY] = { tile: 'ash', safe: true };
                            this.context.drawImage(this.tiles[this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX][spellPosY].tile], spellPosX * this.tileSizePixels, spellPosY * this.tileSizePixels);
                        }

                    }
                    else {
                        this.world.tileset.spells[index].position = {
                            position: 'absolute',
                            left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                            top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
                        }
                    }

                }, 100);
            }
        }
        else {
            this.log('I do not have enough mana to do that.');
        }
    }

    public harmTile(num, biome) {
        let tile;
        if (this.world.overrides[this.world.tileset.tilesetX] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][this.world.relativePosX] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][this.world.relativePosX][this.world.relativePosY]) {
            tile = this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][this.world.relativePosX][this.world.relativePosY].tile;
        }
        else {
            tile = Biomes.getTile(num, biome);
        }

        switch (tile) {
            case 'thorns':
                this.addHealth(-this.world.player.stats.health.max / 20);
                break;
            case 'ash':
                if (Math.random() * 20 < 1) {
                    this.log('The ash was too hot to walk on!');
                    this.damageOverTime(this.world.player.stats.health.max / 5, 5);
                }
                break;
        }
    }

    public spawnEntity(entity, behavior) {
        entity.health = entity.healthDefault;
        entity.x = Math.floor(Math.random() * this.amountXTiles);
        entity.y = Math.floor(Math.random() * this.amountYTiles);
        let index = this.world.tileset.entities.length;
        let coordX = entity.x * this.tileSizePixels;
        let coordY = entity.y * this.tileSizePixels;
        
        this.world.tileset.entities.push({
            src: entity.src + entity.rotation + entity.fileType,
            position: {
                position: 'absolute',
                left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
            }
        });

        entity.entityBehavior = behavior;
        entity.entityBehavior(entity, index);
    }

    public distance(x1, y1, x2, y2) {
        let x = Math.abs(x1 - x2);
        let y = Math.abs(y1 - y2);
        return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    }

    private damageOverTime(damage, time, tick = 1) {
        damage = Math.floor(damage);
        let dps = Math.ceil(damage / time);
        let dot = setInterval(
            () => {
                if(time <= 0) {
                    clearInterval(dot);
                }
                else {
                    time--;
                    this.addHealth(-dps);
                }
            }, tick * 1000);
    }

    private clearMemory() {
        this.world.tileset.spells.forEach(spell => {
            clearInterval(spell.life);
        });
        this.world.tileset.spells = [];

        this.world.tileset.entities.forEach(entity => {
            clearInterval(entity.life);
        });
        this.world.tileset.entities = [];
    }

    private getTile(globalX, globalY): Tile {
        let tilesetX = Math.floor(globalX / this.amountXTiles);
        let tilesetY = Math.floor(globalY / this.amountYTiles);
        let relX = globalX % this.amountXTiles;
        let relY = globalY % this.amountYTiles;
        if (this.world.overrides[tilesetX] &&
            this.world.overrides[tilesetX][tilesetY] && 
            this.world.overrides[tilesetX][tilesetY][relX] &&
            this.world.overrides[tilesetX][tilesetY][relX][relY]) {
                return this.world.overrides[tilesetX][tilesetY][relX][relY];
        }
        else {
            Biomes.getTile((this.pattern.noise2D(globalX, globalY) + 1) / 2, Biomes.getBiome((this.pattern.noise2D(tilesetX, tilesetY) + 1) / 2));
        }
    }

    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }
}