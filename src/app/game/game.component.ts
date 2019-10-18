import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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

    context;
    subscription: SubscriptionObject = {};
    consoleLog: string = ``;
    creatingWorld: boolean = false;
    amountXTiles = 31;
    amountYTiles = 21;
    tileSizePixels = 24;
    canvasWidth = this.amountXTiles * this.tileSizePixels;
    canvasHeight = this.amountYTiles * this.tileSizePixels;

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

            this.context = this.canvas.nativeElement.getContext('2d'); // tmp

            let pattern = new SimplexNoise(seed.toString());
            let pattern2d = new Array(this.amountXTiles);
            for (let x = 0; x < this.amountXTiles; x++) {
                let arr = new Array(this.amountYTiles);
                for (let y = 0; y < this.amountYTiles; y++) {
                    arr[y] = (pattern.noise2D(x,y) + 1) / 2;

                    // tmp

                    let color = Math.floor(arr[y] * 256);
                    this.context.fillStyle = 'rgb(' + color + ', ' + color + ', ' + color + ')';
                    this.context.fillRect(x*this.tileSizePixels,y*this.tileSizePixels,this.tileSizePixels,this.tileSizePixels);

                    // ^tmp
                }
                pattern2d[x] = arr;
            } 

            console.log(pattern2d);

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

    public log(message): void {
        this.consoleLog = `[${new Date().toLocaleTimeString()}] > ${message} <br>` + this.consoleLog;
    }

    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }
}