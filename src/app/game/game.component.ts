import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { SOM, SubscriptionObject } from '../som/SubscriptionObject';
import * as SimplexNoise from 'simplex-noise';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    @ViewChild('args', { static: true }) commandLine;
    @ViewChild('canvas', { static: true }) canvas;
    @ViewChild('grass1', { static: true }) tileGrass1;
    @ViewChild('grass2', { static: true }) tileGrass2;
    @ViewChild('grass3', { static: true }) tileGrass3;
    @ViewChild('tree', { static: true }) tileTree;
    @ViewChild('stump', { static: true }) tileStump;
    @ViewChild('rock', { static: true }) tileRock;
    @ViewChild('lake', { static: true }) tileLake;

    @HostListener('document:keypress', ['$event'])
    movement(event: KeyboardEvent) {
        if(this.commandLine.nativeElement !== document.activeElement) {
            if( event.key === 'w') {

            }
            else if (event.key === 's') {

            }
            else if (event.key === 'a') {

            }
            else if (event.key === 'd') {

            }
            event.stopPropagation();
        }
        
        console.log(event);
        //event.preventDefault();
        
    }
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
        tileX: 0,
        tileY: 0
    }
    characterSrc = '../../assets/character/front.png';
    characterPos = {
        position: 'absolute',
        left: (this.world.posX * this.tileSizePixels + this.tileSizePixels/3*2 ) + 'px',
        top: (this.world.posY * this.tileSizePixels + this.tileSizePixels/3*2+1 ) + 'px'
    };

    constructor() { }

    ngOnInit(): void {
    }

    public submit() {
        this.log('woof?');
    }

    public startWorldCreation() {
        if(!this.creatingWorld){
            this.log('Please, write in the world name and the seed. The seed may be empty for a random one.');
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

            this.context = this.canvas.nativeElement.getContext('2d'); // tmp

            this.pattern = new SimplexNoise(seed.toString());
            let pattern2d = new Array(this.amountXTiles);
            for (let x = 0; x < this.amountXTiles; x++) {
                let arr = new Array(this.amountYTiles);
                for (let y = 0; y < this.amountYTiles; y++) {
                    let num = (this.pattern.noise2D(x,y) + 1) / 2;
                    arr[y] = num;


                    let tile;
                    if (num < 0.05) tile = this.tileLake.nativeElement;
                    else if (num < 0.1) tile = this.tileStump.nativeElement;
                    else if (num < 0.35) tile = this.tileGrass1.nativeElement;
                    else if (num < 0.6) tile = this.tileGrass2.nativeElement;
                    else if (num < 0.85) tile = this.tileGrass3.nativeElement;
                    else if (num < 0.9) tile = this.tileRock.nativeElement;
                    else tile = this.tileTree.nativeElement;

                    this.context.drawImage(tile, x*this.tileSizePixels, y*this.tileSizePixels);
                    
/*
                    let color = Math.floor(arr[y] * 256);
                    this.context.fillStyle = 'rgb(' + color + ', ' + color + ', ' + color + ')';
                    this.context.fillRect(x*this.tileSizePixels, y*this.tileSizePixels, this.tileSizePixels, this.tileSizePixels);
*/
                }
                pattern2d[x] = arr;
            } 

            this.addCharacter();

            this.log('World created');
        }
        else {
            this.log('World name must be at least 3 characters long!');
        }

        if (event) event.stopPropagation();

    }

    public command(argstr: string): void {
        const args = argstr.split(' ');
        this.log(argstr);
        switch(args[0]) {
            case 'clear': // Clears the console
                this.consoleLog = '';
            break;
            case 'createworld': // Creates world with give name and (optional) seed
                let name = args[1];
                let seed = args[2];
                this.worldCreation(name, (seed || undefined), undefined);
            break;
        }
        this.commandLine.nativeElement.value = '';  
    }

    public addCharacter() {
        let coordX = (this.world.posX - this.world.tileX * this.amountXTiles) * this.tileSizePixels;
        let coordY = (this.world.posY - this.world.tileY * this.amountYTiles) * this.tileSizePixels;
        this.characterPos.left = coordX + this.tileSizePixels/3*2 + 'px';
        this.characterPos.top = coordY + this.tileSizePixels/3*2+1 + 'px';
    }

    public log(message): void {
        this.consoleLog = `[${new Date().toLocaleTimeString()}] > ${message} <br>` + this.consoleLog;
    }

    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }
}