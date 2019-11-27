import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { SOM, SubscriptionObject } from '../som/SubscriptionObject';
import * as SimplexNoise from 'simplex-noise';
import * as Biomes from '../shared/world/biomes';
import Items from '../shared/player/items';
import { environment } from 'src/environments/environment';
import Spells from '../shared/spells/spells';
import { World } from '../shared/types/world.interface';
import { Tile } from '../shared/types/tile.interface';
import Entities from '../shared/entities/entities';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import tests from '../shared/tests';
import { Subject } from 'rxjs';
import { Quest } from '../shared/types/quest.interface';

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
    @ViewChild('treeSnow', { static: true }) tileTreeSnow: ElementRef;
    @ViewChild('pine', { static: true }) tilePine: ElementRef;
    @ViewChild('pineSnow', { static: true }) tilePineSnow: ElementRef;
    @ViewChild('stump', { static: true }) tileStump: ElementRef;
    @ViewChild('rock', { static: true }) tileRock: ElementRef;
    @ViewChild('lake', { static: true }) tileLake: ElementRef;
    @ViewChild('herbRed', { static: true }) tileHerbRed: ElementRef;
    @ViewChild('herbBlue', { static: true }) tileHerbBlue: ElementRef;
    @ViewChild('herbCollected', { static: true }) tileHerbCollected: ElementRef;
    @ViewChild('thorns', { static: true }) tileThorns: ElementRef;
    @ViewChild('ash', { static: true }) tileAsh: ElementRef;
    @ViewChild('ashSnow', { static: true }) tileAshSnow: ElementRef;
    @ViewChild('ashSand', { static: true }) tileAshSand: ElementRef;
    @ViewChild('snow1', { static: true }) tileSnow1: ElementRef;
    @ViewChild('snow2', { static: true }) tileSnow2: ElementRef;
    @ViewChild('snow3', { static: true }) tileSnow3: ElementRef;
    @ViewChild('sand1', { static: true }) tileSand1: ElementRef;
    @ViewChild('sand2', { static: true }) tileSand2: ElementRef;
    @ViewChild('sand3', { static: true }) tileSand3: ElementRef;
    @ViewChild('smallRocks', { static: true }) tileSmallRocks: ElementRef;
    @ViewChild('cactus', { static: true }) tileCactus: ElementRef;

    @HostListener('document:keypress', ['$event'])
    handleKeys(event: KeyboardEvent): void {
        console.log(event.key);
        if (this.commandLine.nativeElement !== document.activeElement && !this.dead) {
            if (event.key === 'w') {
                this.world.player.rotation = 'back';
                this.characterSrc = environment.component + 'character/back.png';
                let y = this.world.relativePosY <= 0 ? this.world.tileset.tilesetY - 1 : this.world.tileset.tilesetY;
                if (this.getTile(this.world.posX, this.world.posY - 1).safe) {
                    this.world.posY = this.world.posY - 1;
                    this.harmTile(this.world.posX, this.world.posY);
                    if (this.world.relativePosY <= 0) {
                        this.world.tileset.tilesetY = this.world.tileset.tilesetY - 1;
                        this.world.relativePosY = this.amountYTiles - 1;
                        this.generateMap();
                    }
                }
                else {
                    if (this.getTile(this.world.posX, this.world.posY - 1).harming) {
                        this.addHealth(-1);
                    }
                }
            }
            else if (event.key === 's') {
                this.world.player.rotation = 'front';
                let y = this.world.relativePosY >= this.amountYTiles - 1 ? this.world.tileset.tilesetY + 1 : this.world.tileset.tilesetY;
                this.characterSrc = environment.component + 'character/front.png';
                if (this.getTile(this.world.posX, this.world.posY + 1).safe) {
                    this.world.posY = this.world.posY + 1;
                    this.harmTile(this.world.posX, this.world.posY);
                    if (this.world.relativePosY >= this.amountYTiles - 1) {
                        this.world.tileset.tilesetY = this.world.tileset.tilesetY + 1;
                        this.world.relativePosY = 0;
                        this.generateMap();
                    }
                }
                else {
                    if (this.getTile(this.world.posX, this.world.posY + 1).harming) {
                        this.addHealth(-1);
                    }
                }
            }
            else if (event.key === 'a') {
                this.world.player.rotation = 'left';

                this.characterSrc = environment.component + 'character/left-' + (this.step ? '1.png' : '2.png');
                this.step = !this.step;
                let x = this.world.relativePosX <= 0 ? this.world.tileset.tilesetX - 1 : this.world.tileset.tilesetX;
                if (this.getTile(this.world.posX - 1, this.world.posY).safe) {
                    this.world.posX = this.world.posX - 1;
                    this.harmTile(this.world.posX, this.world.posY);
                    if (this.world.relativePosX <= 0) {
                        this.world.tileset.tilesetX = this.world.tileset.tilesetX - 1;
                        this.world.relativePosX = this.amountXTiles - 1;
                        this.generateMap();
                    }
                }
                else {
                    if (this.getTile(this.world.posX - 1, this.world.posY).harming) {
                        this.addHealth(-1);
                    }
                }
            }
            else if (event.key === 'd') {
                this.world.player.rotation = 'right';
                this.characterSrc = environment.component + 'character/right-' + (this.step ? '1.png' : '2.png');
                this.step = !this.step;

                let x = this.world.relativePosX >= this.amountXTiles - 1 ? this.world.tileset.tilesetX + 1 : this.world.tileset.tilesetX;
                if (this.getTile(this.world.posX + 1, this.world.posY).safe) {
                    this.world.posX = this.world.posX + 1;
                    this.harmTile(this.world.posX, this.world.posY);
                    if (this.world.relativePosX >= this.amountXTiles - 1) {
                        this.world.tileset.tilesetX = this.world.tileset.tilesetX + 1;
                        this.world.relativePosX = 0;
                        this.generateMap();
                    }
                }
                else {
                    if (this.getTile(this.world.posX + 1, this.world.posY).harming) {
                        this.addHealth(-1);
                    }
                }
            }
            else if (event.key === ' ') {
                this.action();
            }
            else if (event.key === 'f') {
                if (this.cooldown === undefined) {
                    this.cooldown = setTimeout(() => {
                        this.cast(Spells['fireball']);
                        clearTimeout(this.cooldown);
                        this.cooldown = undefined;
                    }, 250);
                }
            }
            event.stopPropagation();
            this.setCharacterPos();
            event.preventDefault();
        }

        if (event.which === 13 || event.keyCode === 13) { // enter
                this.command(this.commandLine.nativeElement.value);
                event.stopPropagation();
                event.preventDefault();
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleArrows(event: KeyboardEvent): void {
        if (event.which === 38 || event.keyCode === 38) { // arrow up
            this.currentCommand = this.commandLine.nativeElement.value;
            this.commandLine.nativeElement.value = this.lastCommand;
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.which === 40 || event.keyCode === 40) { // arrow up
            this.commandLine.nativeElement.value = this.currentCommand;
            event.stopPropagation();
            event.preventDefault();
        }
    }

    questline$: Subject<{task: string, target: string}>;
    currentQuest: Quest;

    lastCommand = '';
    currentCommand = '';
    env: any;
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
    dead: boolean = false;
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
        },
        created: null
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
            let direction = { x: 0, y: 0 };
            let despawned = false;
            this.world.tileset.entities[index].life = setInterval(
                () => {
                    if (this.distance(this.world.relativePosX, this.world.relativePosY, entity.x, entity.y)<= entity.visionRadius) {
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
                        let dir = Math.floor(Math.random() * 4);
                        const directionArray = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                        const rotationArray = ['right', 'left', 'front', 'back'];
                        direction = directionArray[dir];
                        entity.rotation = rotationArray[dir];
                    }

                    let tries = 0;
                    while (!this.getTile(entity.x + this.world.tileset.tilesetX * this.amountXTiles + direction.x, entity.y + this.world.tileset.tilesetY * this.amountYTiles + direction.y).safe && tries < 8) {
                        tries++;
                        let dir = Math.floor(Math.random() * 4);
                        const directionArray = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                        const rotationArray = ['right', 'left', 'front', 'back'];
                        direction = directionArray[dir];
                        entity.rotation = rotationArray[dir];
                    }

                    if (tries >= 8) {
                        entity.health = 0;
                        despawned = true;
                    }
                    else {
                        entity.x += direction.x;
                        entity.y += direction.y;
                    }

                    let coordX = entity.x * this.tileSizePixels;
                    let coordY = entity.y * this.tileSizePixels;

                    if (entity.x < 0 || entity.y < 0 || entity.x >= this.amountXTiles || entity.y >= this.amountYTiles) {
                        entity.health = 0;
                        despawned = true;
                    }
                    else {
                        this.world.tileset.entities[index].src = entity.src + entity.rotation + entity.fileType;
                        this.world.tileset.entities[index].position = {
                            position: 'absolute',
                            left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                            top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
                        }
                        this.world.tileset.entities[index].x = entity.x;
                        this.world.tileset.entities[index].y = entity.y;
                    }

                    if (entity.health <= 0) {
                        clearInterval(this.world.tileset.entities[index].life);
                        this.world.tileset.entities[index].position = {
                            position: 'absolute',
                            left: '0px',
                            top: '0px',
                            display: 'none'
                        };

                        if(!despawned) {
                            this.questline$.next({task: 'kill', target: entity.entity.name});
                        }
                    }
                }, interval);

        },
        sleeping: () => {
            // staying on a place, until player attacks, then changes to either shy or aggressive
        },
        careless: () => {
            // casually moving around unless attacked, does not mind the player
        },
        aggressive: (entity, index) => {
            let interval = 1500;
            let direction = { x: 0, y: 0 };
            this.world.tileset.entities[index].life = setInterval(
                () => {
                    let dist = this.distance(this.world.relativePosX, this.world.relativePosY, entity.x, entity.y);
                    if (dist <= entity.visionRadius && dist >= 2) {
                        direction.x = -Math.sign(entity.x - this.world.relativePosX);
                        direction.y = -Math.sign(entity.y - this.world.relativePosY);
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
                    
                    else if(dist <= 2) {
                        direction = {x: 0, y: 0};
                        this.addHealth(-entity.damage);
                    }

                    else {
                        let dir = Math.floor(Math.random() * 4);
                        const directionArray = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                        const rotationArray = ['right', 'left', 'front', 'back'];
                        direction = directionArray[dir];
                        entity.rotation = rotationArray[dir];
                    }

                    let tries = 0;
                    while (!this.getTile(entity.x + this.world.tileset.tilesetX * this.amountXTiles + direction.x, entity.y + this.world.tileset.tilesetY * this.amountYTiles + direction.y).safe && tries < 8) {
                        tries++;
                        let dir = Math.floor(Math.random() * 4);
                        const directionArray = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                        const rotationArray = ['right', 'left', 'front', 'back'];
                        direction = directionArray[dir];
                        entity.rotation = rotationArray[dir];
                    }

                    if (tries >= 8) {
                        entity.health = 0;
                    }
                    else {
                        entity.x += direction.x;
                        entity.y += direction.y;
                    }

                    let coordX = entity.x * this.tileSizePixels;
                    let coordY = entity.y * this.tileSizePixels;

                    if (entity.x < 0 || entity.y < 0 || entity.x >= this.amountXTiles || entity.y >= this.amountYTiles) {
                        entity.health = 0;
                    }
                    else {
                        this.world.tileset.entities[index].src = entity.src + entity.rotation + entity.fileType;
                        this.world.tileset.entities[index].position = {
                            position: 'absolute',
                            left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                            top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
                        }
                        this.world.tileset.entities[index].x = entity.x;
                        this.world.tileset.entities[index].y = entity.y;
                    }

                    if (entity.health <= 0) {
                        clearInterval(this.world.tileset.entities[index].life);
                        this.world.tileset.entities[index].position = {
                            position: 'absolute',
                            left: '0px',
                            top: '0px',
                            display: 'none'
                        };
                    }
                }, interval);

        }
    }

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
        this.questline$ = new Subject();
        this.subscription.questline = this.questline$.subscribe((questReport) => {
            if(this.currentQuest) {
                if(questReport.task === this.currentQuest.task && questReport.target === this.currentQuest.target) {
                    this.currentQuest.current++;

                    if(this.currentQuest.current >= this.currentQuest.amount) {
                        this.addExperience(this.currentQuest.reward.xp);
                        //this.addGold(this.currentQuest.reward.gold);
                        this.currentQuest = null;
                    }
                }
            }
        });


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
            this.world.posX = 15;
            this.world.posY = 10;
            this.world.tileset.tilesetX = 0;
            this.world.tileset.tilesetY = 0;
            this.world.relativePosX = 15;
            this.world.relativePosY = 10;
            this.world.overrides = [];
            this.world.created = new Date();

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
        this.lastCommand = argstr;
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
                        try {
                            this.worldCreation(name, (seed || undefined), undefined);
                        }
                        catch {
                            this.log('This won\'t work.');
                        }   
                        break;
                    case 'givexp':
                        this.addExperience(+args[1] || 0);
                        break;
                    case 'suicide':
                        this.death();
                        break;
                    case 'givehp':
                        this.addHealth(+args[1] || 0);
                        break;
                    case 'givemp':
                        this.addMana(+args[1] || 0);
                        break;
                    case 'fillhp':
                        this.addHealth(this.world.player.stats.health.max);
                        break;
                    case 'fillmp':
                        this.addMana(this.world.player.stats.mana.max);
                        break;
                    case 'tp':
                        if (!isNaN(+args[1]) && !isNaN(+args[2])) {
                            this.world.posX = +args[1];
                            this.world.posY = +args[2];
                            this.world.tileset.tilesetX = Math.floor(this.world.posX / this.amountXTiles);
                            this.world.tileset.tilesetY = Math.floor(this.world.posY / this.amountYTiles);
                            this.generateMap();
                            this.setCharacterPos();
                        }
                        else {
                            this.log('These coordinates will not work.');
                        }
                        break;
                    case 'rtp':
                        try {
                            this.world.posX = Math.floor(Math.random() * 10000);
                            this.world.posY = Math.floor(Math.random() * 10000);
                            this.world.tileset.tilesetX = Math.floor(this.world.posX / this.amountXTiles);
                            this.world.tileset.tilesetY = Math.floor(this.world.posY / this.amountYTiles);
                            this.generateMap();
                            this.setCharacterPos();
                        }
                        catch {
                            this.log('This will not work now.');
                        }
                        break;
                    case 'summon':
                        let count = +args[2];
                        if (isNaN(count)) {
                            count = 1;
                        }
                        switch (args[1]) {
                            case 'Bunny':
                                this.log(count == 1 ? 'Spawned a Bunny' : ('Spawned ' + count + ' Bunnies.'));
                                for (let i = 0; i < count; i++) {
                                    this.spawnEntity(Entities.bunny, this.entityBehavior.shy);
                                }
                                break;
                            case 'Spider':
                                this.log(count == 1 ? 'Spawned a Spider' : ('Spawned ' + count + ' Spiders.'));
                                for (let i = 0; i < count; i++) {
                                    this.spawnEntity(Entities.spider, this.entityBehavior.aggressive);
                                }
                                break;
                            default:
                                this.log('Unknown Entity.');
                                break;
                        }
                        break;
                    case 'inventory':
                        this.openInventory();
                        break;
                    case 'test':
                        try {
                            this.test(args[1]);
                        }
                        catch {
                            this.log('Unknown test.');
                        }
                        break;
                    case 'action':
                        this.action();
                        break;
                    case 'map':
                        this.openMap();
                        break;
                    case 'statistics':
                        this.openStatistics();
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
            let summonAmount = 1;
            if(entity.chance > 1) {
                summonAmount = Math.floor(entity.chance + 1);
            }
            for (let i = 0; i < summonAmount; i++) {
                if (Math.random() > (entity.chance % 1)) {
                    this.spawnEntity(Entities[entity.entity], this.entityBehavior[entity.behavior]);
                }
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

        if (this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x] && this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][x][y]) {
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
                this.questline$.next({task: 'collect', target: tile});
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
            cactus: this.tileCactus.nativeElement,
            sand1: this.tileSand1.nativeElement,
            sand2: this.tileSand2.nativeElement,
            sand3: this.tileSand3.nativeElement,
            snow1: this.tileSnow1.nativeElement,
            snow2: this.tileSnow2.nativeElement,
            snow3: this.tileSnow3.nativeElement,
            treeSnow: this.tileTreeSnow.nativeElement,
            pine: this.tilePine.nativeElement,
            pineSnow: this.tilePineSnow.nativeElement,
            smallRocks: this.tileSmallRocks.nativeElement,
            ash: this.tileAsh.nativeElement,
            ashSnow: this.tileAshSnow.nativeElement,
            ashSand: this.tileAshSand.nativeElement
        }
    }

    private addToInventory(item) {
        let Item = JSON.parse(JSON.stringify(Items[item]));
        if (this.world.player.inventory.items[item]) {
            if (this.world.player.inventory.items[item].quantity < 1000) {
                this.world.player.inventory.items[item].quantity += 1;
            }
        }
        else {
            this.world.player.inventory.items[item] = Item;
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
        this.dead = true;
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
        this.dead = false;
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

    public cast(Spell) {
        let spell = JSON.parse(JSON.stringify(Spell));
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
                    },
                    rotation: this.world.player.rotation
                });
                this.world.tileset.spells[index].life = setInterval(() => {
                    spellPosX += direction.x;
                    spellPosY += direction.y;
                    coordX = spellPosX * this.tileSizePixels;
                    coordY = spellPosY * this.tileSizePixels;
                    let num = (this.pattern.noise2D(spellPosX + this.amountXTiles * this.world.tileset.tilesetX, spellPosY + this.amountYTiles * this.world.tileset.tilesetY) + 1) / 2;
                    let safeTile;
                    safeTile = this.getTile(this.toGlobalX(spellPosX), this.toGlobalY(spellPosY)).safe;
                    let entityHit = false;

                    for (let i = 0, j = this.world.tileset.entities.length; i < j; i++) {
                        let entity = this.world.tileset.entities[i];
                        if (this.distance(entity.x, entity.y, spellPosX, spellPosY) === 0) {
                            entityHit = true;
                            entity.entity.health -= spell.damage;
                            if (entity.entity.health <= 0) {
                                this.addExperience(entity.entity.expReward);
                                entity.src = environment.component + '/entities/entity-ash.png';
                            }
                            break;
                        }
                    }

                    if (spellPosX < 0 || spellPosX >= this.amountXTiles || spellPosY < 0 || spellPosY >= this.amountYTiles || !(safeTile) || entityHit) {
                        clearInterval(this.world.tileset.spells[index].life);
                        this.world.tileset.spells[index].src = spell.endSrc + this.world.tileset.spells[index].rotation + spell.fileType;
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

                            let ash = { tile: 'ash', safe: true, harming: true };
                            if (this.world.tileset.biome == 'desert') {
                                ash = { tile: 'ashSand', safe: true, harming: true };
                            }
                            else if (this.world.tileset.biome == 'tundra' || this.world.tileset.biome == 'taiga') {
                                ash = { tile: 'ashSnow', safe: true, harming: true };
                            }

                            this.world.overrides[this.world.tileset.tilesetX][this.world.tileset.tilesetY][spellPosX][spellPosY] = ash;
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

    public harmTile(x, y) {
        let tile = this.getTile(x, y).tile;

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

    public spawnEntity(Entity, behavior) {
        let entity = JSON.parse(JSON.stringify(Entity));
        entity.x = Math.floor(Math.random() * this.amountXTiles);
        entity.y = Math.floor(Math.random() * this.amountYTiles);
        let index = this.world.tileset.entities.length;
        let coordX = entity.x * this.tileSizePixels;
        let coordY = entity.y * this.tileSizePixels;

        this.world.tileset.entities.push({
            entity: entity,
            src: entity.src + entity.rotation + entity.fileType,
            position: {
                position: 'absolute',
                left: (coordX + this.tileSizePixels / 3 * 2) + 'px',
                top: (coordY + this.tileSizePixels / 3 * 2 + 1) + 'px'
            },
            x: entity.x,
            y: entity.y
        });

        entity.entityBehavior = behavior;
        entity.entityBehavior(entity, index);
    }

    public distance(x1, y1, x2, y2) {
        let x = Math.abs(x1 - x2);
        let y = Math.abs(y1 - y2);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    private damageOverTime(damage, time, tick = 1) {
        damage = Math.floor(damage);
        let dps = Math.ceil(damage / time);
        let dot = setInterval(
            () => {
                if (time <= 0) {
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
        let relX = (globalX - this.world.tileset.tilesetX * this.amountXTiles)
        let relY = (globalY - this.world.tileset.tilesetY * this.amountYTiles);
        if (this.world.overrides[tilesetX] &&
            this.world.overrides[tilesetX][tilesetY] &&
            this.world.overrides[tilesetX][tilesetY][relX] &&
            this.world.overrides[tilesetX][tilesetY][relX][relY]) {
            return this.world.overrides[tilesetX][tilesetY][relX][relY];
        }
        else {
            return Biomes.getTile((this.pattern.noise2D(globalX, globalY) + 1) / 2, Biomes.getBiome((this.pattern.noise2D(tilesetX, tilesetY) + 1) / 2));
        }
    }

    private toGlobalX(x): number {
        return x + this.world.tileset.tilesetX * this.amountXTiles;
    }

    private toGlobalY(y): number {
        return y + this.world.tileset.tilesetY * this.amountYTiles;
    }

    public openInventory(): void {
        const dialogRef = this.dialog.open(Inventory, {
            data: this
        });

        this.subscription.inventory = dialogRef.afterClosed().subscribe();
    }

    public openMap(): void {
        const dialogRef = this.dialog.open(Map, {
            data: this
        });

        this.subscription.map = dialogRef.afterClosed().subscribe();
    }

    public openStatistics(): void {
        const dialogRef = this.dialog.open(Statistics, {
            data: this
        });

        this.subscription.statistics = dialogRef.afterClosed().subscribe();
    }

    public test(type): void {
        let commands = tests[type];
        commands.forEach(command => {
            this.command(command);
        });
    }

    public acceptQuest(Quest) {
        if(this.currentQuest !== null) {
            this.log('You already have a quest.');
        } 
        else {
            this.currentQuest = JSON.parse(JSON.stringify(Quest));
        }
    }


    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }
}

// ==========================================================================================================================================================================
// ==========================================================================================================================================================================
// ==========================================================================================================================================================================

@Component({
    selector: 'inventory',
    template: `<h3>Inventory</h3>
<div id="inventory">
    <div class="invIcon" *ngFor="let item of data.getItems()" (click)="data.useItem(item)">
        <div class="itemIcon">
            <img src="{{data.world.player.inventory.items[item].icon}}" [alt]="data.world.player.inventory.items[item].name">
        </div>
        <div class="itemQuantity">
            {{ data.world.player.inventory.items[item].quantity }}
        </div>
        <div class="item">
            <div class="itemHeading">
                <div class="itemName">{{ data.world.player.inventory.items[item].name }}</div>
                <div class="itemQuantity">{{ data.world.player.inventory.items[item].quantity }}</div>
            </div>
            <div class="itemDescription">
                {{ data.world.player.inventory.items[item].description }}
            </div>
        </div>
    </div>
</div>`,
styleUrls: ['./inventory.scss']
})
export class Inventory {
    constructor(
        public dialogRef: MatDialogRef<Inventory>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}


@Component({
    selector: 'map',
    template: `<h3>Map</h3>
<div id="map">
    <canvas id="mapCanvas" [width]="600" [height]="600" #mapCanvas></canvas>
</div>
    `,
styleUrls: ['./map.scss']
})
export class Map implements AfterViewInit {
    @ViewChild('mapCanvas', { static: true }) mapCanvas: ElementRef;
    constructor(
        public dialogRef: MatDialogRef<Map>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    ngAfterViewInit() {
        let context = this.mapCanvas.nativeElement.getContext('2d');
        const pattern = new SimplexNoise(this.data.world.seed.toString());

        for (let x = 0; x < 25; x++) {
            for (let y = 0; y < 25; y++) {
                let num = (pattern.noise2D(x-12 + this.data.world.tileset.tilesetX, y-12 + this.data.world.tileset.tilesetY) + 1) / 2;
                context.fillStyle = Biomes.getColor(num);
                context.fillRect((x * 24), (y * 24), 24, 24);
            }
        }

        context.fillStyle = '#ff0000';
        context.fillRect((12 * 24 + 4), (12 * 24 + 4), 16, 16);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}


@Component({
    selector: 'statistics',
    template: `<h3>Statistics</h3>
<div id="statistics">
    <div><span>World: </span>{{ data.world.name }}</div>
    <div><span>Seed: </span>{{ data.world.seed }}</div>
    <div><span>Biome: </span>{{ data.world.tileset.biome }}</div>
    <div><span>Position: </span> <span>x:</span>{{ data.world.posX }}<span>y:</span>{{ data.world.posY }}</div>
    <div><span>Tileset: </span> <span>x:</span>{{ data.world.tileset.tilesetX }}<span>y:</span>{{ data.world.tileset.tilesetY }}</div>
    <div><span>World created: </span> {{ getCreated() }}
</div>`,
styleUrls: ['./statistics.scss']
})
export class Statistics {
    constructor(
        public dialogRef: MatDialogRef<Statistics>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public getCreated() {
        let months = ['January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'];
        let date = this.data.world.created;
        let createdAt = 
            this.number(date.getDate()) + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() +
            ', ' + (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + 
            ':' + (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + 
            ':' + (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds());
        return createdAt;
    }

    public number(n) {
        switch(n) {
            case (n > 10 && n < 20):
                return n + 'th';
            case n % 10 == 1:
                return n + 'st';
            case n % 10 == 2:
                return n + 'nd';
            case n % 10 == 3:
                return n + 'rd';
            default:
                return n + 'th';
        }
    }
}