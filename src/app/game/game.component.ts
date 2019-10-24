import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { SOM, SubscriptionObject } from '../som/SubscriptionObject';
import * as SimplexNoise from 'simplex-noise';
import * as Biomes from '../shared/types/biomes';

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
    @ViewChild('herbCollected', { static: true }) tileHerbCollected;

    @HostListener('document:keypress', ['$event'])
    movement(event: KeyboardEvent) {
        console.log(this.world.relativePosX, this.world.relativePosY);
        if (this.commandLine.nativeElement !== document.activeElement) {
            if (event.key === 'w') {
                this.characterSrc = '../../assets/character/back.png';
                if (this.safeTile(this.world.posX, this.world.posY - 1)) {
                    this.world.posY = this.world.posY - 1;
                    if (this.world.relativePosY <= 0) {
                        this.world.tileset.tileSetY = this.world.tileset.tileSetY - 1;
                        this.world.relativePosY = this.amountYTiles - 1;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 's') {
                this.characterSrc = '../../assets/character/front.png';
                if (this.safeTile(this.world.posX, this.world.posY + 1)) {
                    this.world.posY = this.world.posY + 1;
                    if (this.world.relativePosY >= this.amountYTiles - 1) {
                        this.world.tileset.tileSetY = this.world.tileset.tileSetY + 1;
                        this.world.relativePosY = 0;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 'a') {
                if (this.step) {
                    this.characterSrc = '../../assets/character/left-1.png';
                } else {
                    this.characterSrc = '../../assets/character/left-2.png';
                }
                this.step = !this.step;
                if (this.safeTile(this.world.posX - 1, this.world.posY)) {
                    this.world.posX = this.world.posX - 1;
                    if (this.world.relativePosX <= 0) {
                        this.world.tileset.tileSetX = this.world.tileset.tileSetX - 1;
                        this.world.relativePosX = this.amountXTiles - 1;
                        this.generateMap();
                    }
                }
            }
            else if (event.key === 'd') {
                if (this.step) {
                    this.characterSrc = '../../assets/character/right-1.png';
                } else {
                    this.characterSrc = '../../assets/character/right-2.png';
                }
                this.step = !this.step;
                if (this.safeTile(this.world.posX + 1, this.world.posY)) {
                    this.world.posX = this.world.posX + 1;
                    if (this.world.relativePosX >= this.amountXTiles - 1) {
                        this.world.tileset.tileSetX = this.world.tileset.tileSetX + 1;
                        this.world.relativePosX = 0;
                        this.generateMap();
                    }
                }
            }
            event.stopPropagation();
            this.setCharacterPos();
            event.preventDefault();
        }
    }


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
            tileSetX: 0,
            tileSetY: 0,
            biome: 'plains',
            override: {
                //x:y:{tile:tile, safe:bool}
            }
        },
        spawnPointX: 15,
        spawnPointY: 10
    }
    tiles = {};
    characterSrc = '../../assets/character/front.png';
    characterPos = {
        position: 'absolute',
        left: (this.world.posX * this.tileSizePixels + this.tileSizePixels / 3 * 2) + 'px',
        top: (this.world.posY * this.tileSizePixels + this.tileSizePixels / 3 * 2 + 1) + 'px'
    };
    step: boolean = true;
    player = {
        inventory: {
            items: {
                "Test item": {
                    quantity: 42,
                    description: 'This item is used for testing. If you see it in your inventory, something is not right.',
                    icon: '../../assets/world/chestClosed.png'
                },
                "Test item 2": {
                    quantity: 42,
                    description: 'This item is used for testing. If you see it in your inventory, something is not right.',
                    icon: '../../assets/world/chestClosed.png'
                }
            }
        }
    }

    constructor() { }

    ngOnInit(): void {
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
            this.world.tileset.tileSetX = 0,
            this.world.tileset.tileSetY = 0,
            this.world.relativePosX = 15,
            this.world.relativePosY = 10


            this.generateMap();
            this.setCharacterPos();
            this.log('World created');
        }
        else {
            this.log('World name must be at least 3 characters long!');
        }

        if (event) event.stopPropagation();

    }

    public saveWorld() {
        //fs.writeFileSync('../../assets/' + this.world.name + '.json', JSON.stringify(this.world));
        if(this.world.seed) {
            this.log(JSON.stringify(this.world));
            this.log('Please, save this somewhere:');
        }
        else {
            this.error('There is no world to save!');
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
            }
        }

        this.commandLine.nativeElement.value = '';
    }

    public getItems() {
        return Object.keys(this.player.inventory.items);
    }

    public setCharacterPos() {
        this.world.relativePosX = (this.world.posX - this.world.tileset.tileSetX * this.amountXTiles);
        this.world.relativePosY = (this.world.posY - this.world.tileset.tileSetY * this.amountYTiles);
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
        console.log(this.consoleLog);
    }

    public safeTile(x: number, y: number): boolean {
        return Biomes.getSafeTile((this.pattern.noise2D(x, y) + 1) / 2, this.world.tileset.biome);
        /*if (this.world.seed) {
            let num = (this.pattern.noise2D(x, y) + 1) / 2;
            return ((num >= 0.1) && (num < 0.8));
        }
        else {
            return false;
        }*/
    }

    private generateMap() {
        this.context = this.canvas.nativeElement.getContext('2d'); // tmp

        this.pattern = new SimplexNoise(this.world.seed.toString());
        this.world.tileset.biome = Biomes.getBiome(this.pattern.noise2D(this.world.tileset.tileSetX, this.world.tileset.tileSetY));
        let pattern2d = new Array(this.amountXTiles);

        this.setTiles();

        for (let x = 0; x < this.amountXTiles; x++) {
            let arr = new Array(this.amountYTiles);
            for (let y = 0; y < this.amountYTiles; y++) {
                let num = (this.pattern.noise2D(x + this.world.tileset.tileSetX * this.amountXTiles, y + this.world.tileset.tileSetY * this.amountYTiles) + 1) / 2;
                arr[y] = num;


                let tile;
                /*if (num < 0.05) tile = this.tileLake.nativeElement;
                else if (num < 0.1) tile = this.tileStump.nativeElement;
                else if (num < 0.13) tile = this.tileHerbRed.nativeElement;
                else if (num < 0.36) tile = this.tileGrass1.nativeElement;
                else if (num < 0.62) tile = this.tileGrass2.nativeElement;
                else if (num < 0.80) tile = this.tileGrass3.nativeElement;
                else if (num < 0.9) tile = this.tileRock.nativeElement;
                else tile = this.tileTree.nativeElement;*/
                tile = this.tiles[Biomes.getTile(num, this.world.tileset.biome)];

                this.context.drawImage(tile, x * this.tileSizePixels, y * this.tileSizePixels);
            }
            pattern2d[x] = arr;
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
            herbBlue: null,
            cactus: null,
            sand1: null,
            sand2: null,
            sand3: null
        }
    }

    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }
}