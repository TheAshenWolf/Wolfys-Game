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

    subscription: SubscriptionObject = {};
    consoleLog: string = ``;
    creatingWorld: boolean = false;

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

            let pattern = new SimplexNoise(seed.toString());
            let pattern2d = new Array(30);
            for (let x = 0; x < 30; x++) {
                let arr = new Array(20);
                for (let y = 0; y < 20; y++) {
                    arr[y] = (pattern.noise2D(x,y) + 1) / 2; 
                }
                pattern2d[x] = arr;
            } 

            console.log(pattern2d);

            this.log('World created');
        }
        else {
            this.log('World name must be at least 3 characters long!');
        }

        event.stopPropagation();

    }

    public command(argstr: string): void {
        const args = argstr.split(' ');
        switch(args[0]) {
            case 'clear':
                this.consoleLog = '';
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