import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { SOM, SubscriptionObject } from '../som/SubscriptionObject';
import * as SimplexNoise from 'simplex-noise';
import * as Biomes from '../shared/types/biomes';
import Items from '../shared/types/items';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    @ViewChild('args', { static: true }) commandLine;
    @ViewChild('worldName', { static: true }) set contentWorldName(content: ElementRef) {
        this.worldName = content;
    }
    @ViewChild('worldSeed', { static: true }) set contentWorldSeed(content: ElementRef) {
        this.worldSeed = content;
    }

    @ViewChild('canvas', { static: true }) canvas;
    @ViewChild('grass1', { static: true }) tileGrass1;
    @ViewChild('grass2', { static: true }) tileGrass2;
    @ViewChild('grass3', { static: true }) tileGrass3;
    @ViewChild('tree', { static: true }) tileTree;
    @ViewChild('stump', { static: true }) tileStump;
    @ViewChild('rock', { static: true }) tileRock;
    @ViewChild('lake', { static: true }) tileLake;
    @ViewChild('herbRed', { static: true }) tileHerbRed;
    @ViewChild('herbBlue', { static: true }) tileHerbBlue;
    @ViewChild('herbCollected', { static: true }) tileHerbCollected;

    @HostListener('document:keypress', ['$event'])
    movement(event: KeyboardEvent) {
        if (this.commandLine.nativeElement !== document.activeElement) {
            if (event.key === 'w') {
                this.characterSrc = environment.component + 'character/back.png';
                let y = this.world.relativePosY<= 0 ? this.world.tileset.tilesetY - 1 : this.world.tileset.tilesetY;
                if (this.safeTile(this.world.posX, this.world.posY - 1, Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, y) + 1) / 2))) {
                    this.world.posY = this.world.posY - 1;
                    if (this.world.relativePosY <= 0) {
                        this.world.tileset.tilesetY = this.world.tileset.tilesetY - 1;
                        this.world.relativePosY = this.amountYTiles - 1;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 's') {
                let y = this.world.relativePosY >= this.amountYTiles - 1 ? this.world.tileset.tilesetY + 1 : this.world.tileset.tilesetY;
                this.characterSrc = environment.component + 'character/front.png';
                if (this.safeTile(this.world.posX, this.world.posY + 1, Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, y) + 1) / 2))) {
                    this.world.posY = this.world.posY + 1;
                    if (this.world.relativePosY >= this.amountYTiles - 1) {
                        this.world.tileset.tilesetY = this.world.tileset.tilesetY + 1;
                        this.world.relativePosY = 0;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 'a') {
                if (this.step) {
                    this.characterSrc = environment.component + 'character/left-1.png';
                } else {
                    this.characterSrc = environment.component + 'character/left-2.png';
                }
                this.step = !this.step;
                let x = this.world.relativePosX <= 0 ? this.world.tileset.tilesetX - 1 : this.world.tileset.tilesetX;
                if (this.safeTile(this.world.posX - 1, this.world.posY, Biomes.getBiome((this.pattern.noise2D(x, this.world.tileset.tilesetY) + 1) / 2))) {
                    this.world.posX = this.world.posX - 1;
                    if (this.world.relativePosX <= 0) {
                        this.world.tileset.tilesetX = this.world.tileset.tilesetX - 1;
                        this.world.relativePosX = this.amountXTiles - 1;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 'd') {
                if (this.step) {
                    this.characterSrc = environment.component + 'character/right-1.png';
                } else {
                    this.characterSrc = environment.component + 'character/right-2.png';
                }
                this.step = !this.step;

                let x = this.world.relativePosX >= this.amountXTiles - 1 ? this.world.tileset.tilesetX + 1 : this.world.tileset.tilesetX;
                if (this.safeTile(this.world.posX + 1, this.world.posY, Biomes.getBiome((this.pattern.noise2D(x, this.world.tileset.tilesetY) + 1) / 2))) {
                    this.world.posX = this.world.posX + 1;
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
            event.stopPropagation();
            this.setCharacterPos();
            event.preventDefault();
        }
    }
    env;
    worldName;
    worldSeed;
    context;
    pattern;
    subscription: SubscriptionObject = {};
    consoleLog: string = ``;
    creatingWorld: boolean = false;
    amountXTiles = 31;
    amountYTiles = 21;
    tileSizePixels = 24;
    canvasWidth = this.amountXTiles * this.tileSizePixels;
    canvasHeight = this.amountYTiles * this.tileSizePixels;
    world = {
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
            }
        }
    }
    tiles = {};
    characterSrc = environment.component + 'character/front.png';
    characterPos = {
        position: 'absolute',
        left: (this.world.posX * this.tileSizePixels + this.tileSizePixels / 3 * 2) + 'px',
        top: (this.world.posY * this.tileSizePixels + this.tileSizePixels / 3 * 2 + 1) + 'px'
    };
    step: boolean = true;
    loadingWorld: boolean = false;
    

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
        if(this.world.seed) {
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
                case 'giveExp':
                    this.addExperience(+args[1]);
                    break;
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
        if( this.world.overrides[this.world.tileset.tilesetX] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()]) {
            return this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()].safe;
        }
        return Biomes.getSafeTile((this.pattern.noise2D(x, y) + 1) / 2, biome);
    }

    private generateMap() {
        this.context = this.canvas.nativeElement.getContext('2d'); // tmp

        this.pattern = new SimplexNoise(this.world.seed.toString());
        this.world.tileset.biome = Biomes.getBiome((this.pattern.noise2D(this.world.tileset.tilesetX, this.world.tileset.tilesetY) + 1) / 2);

        if(this.world.overrides[this.world.tileset.tilesetX] === undefined) {
            this.world.overrides[this.world.tileset.tilesetX] = {};
        }
        if(this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] === undefined) {
            this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY] = {};
        }

        this.setTiles();

        for (let x = 0; x < this.amountXTiles; x++) {
            for (let y = 0; y < this.amountYTiles; y++) {
                let num = (this.pattern.noise2D(x + this.world.tileset.tilesetX * this.amountXTiles, y + this.world.tileset.tilesetY * this.amountYTiles) + 1) / 2;

                let tile;
                if(this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()]) {
                    tile =  this.tiles[this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()].tile];
                }
                else {
                    tile = this.tiles[Biomes.getTile(num, this.world.tileset.biome)];
                }
                this.context.drawImage(tile, x * this.tileSizePixels, y * this.tileSizePixels);
            }
        }
    }

    public action() {
        let x = this.world.relativePosX;
        let y = this.world.relativePosY;

        if(this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()]) {
            return null;
        }
        else {
           let tileNum = (this.pattern.noise2D(x + this.world.tileset.tilesetX * this.amountXTiles, y + this.world.tileset.tilesetY * this.amountYTiles) + 1) / 2;
            let tile = Biomes.getTile(tileNum, this.world.tileset.biome);
            if (tile == 'herbRed' || tile == 'herbBlue') {
                if(this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] === undefined) {
                    this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()] = {};
                }
                this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x.toString()][y.toString()] = {tile: 'herbCollected', safe: true};
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
            cactus: null,
            sand1: null,
            sand2: null,
            sand3: null
        }
    }

    private addToInventory(item) {
        if(this.world.player.inventory.items[item]) {
            if(this.world.player.inventory.items[item].quantity < 1000) {
                this.world.player.inventory.items[item].quantity += 1;
            } 
        }
        else {
            this.world.player.inventory.items[item] = Items[item];
        }
    }

    public getHealthFill() {
        let value = ((this.world.player.stats.health.current / this.world.player.stats.health.max) * 100);
        if(value == 100){
            return {'background-color': '#f00'};
        }
        else {
            let obj = 'linear-gradient(to right, #f00, #f00 ' + value + '%, #aaa ' + value + '%, #aaa 100%)';
            return {'background-image': obj};
        }
    }

    public getManaFill() {
        let value = ((this.world.player.stats.mana.current / this.world.player.stats.mana.max) * 100);
        if(value == 100){
            return {'background-color': '#00f'};
        }
        else {
            let obj = 'linear-gradient(to right, #00f, #00f ' + value + '%, #aaa ' + value + '%, #aaa 100%)';
            return {'background-image': obj};
        }
    }

    public getExpFill() {
        let value = ((this.world.player.stats.experience.forNextLevel / this.world.player.stats.experience.nextLevelExp) * 100);
        if(value == 100){
            return {'background-color': '#ff0'};
        }
        else {
            let obj = 'linear-gradient(to right, #ff0, #ff0 ' + value + '%, #aaa ' + value + '%, #aaa 100%)';
            return {'background-image': obj};
        }
    }

    public addExperience(amount) {
        this.world.player.stats.experience.total += amount;

        this.world.player.stats.experience.level = Math.floor(this.world.player.stats.experience.total / 100) + 1;

        this.world.player.stats.experience.forNextLevel = this.world.player.stats.experience.total - (this.world.player.stats.experience.level -1) * 100;
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
            }
        }
    }

    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }
}