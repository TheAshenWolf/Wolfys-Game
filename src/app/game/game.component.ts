import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SOM, SubscriptionObject } from '../som/SubscriptionObject';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    @ViewChild('command', { static: true }) commandLine;

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

    public worldCreation(name, seed, event) {
        if ((name && name.length > 2)) {
            if (seed === undefined || seed === null || seed === '') {
                seed = Math.floor(Math.random() * 10000000);
            }
            this.creatingWorld = false;
            this.log('Started world creation process...');
            this.log('World Name: ' + name);
            this.log('World Seed: ' + seed);
        }
        else {
            this.log('World name must be at least 3 characters long!');
        }

        event.stopPropagation();

    }

    public log(message) {
        this.consoleLog = `[${new Date().toLocaleTimeString()}] > ${message} <br>` + this.consoleLog;
    }


    ngOnDestroy(): void {
        SOM.clearSubscriptionsObject(this.subscription);
    }

}
