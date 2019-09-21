import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    /*
        var terminal = document.getElementById("log");
            var command = document.getElementById("command-line");
            var runButton = document.getElementById("run-button");
    
            var createWorldButton = document.getElementById("create-world");
            createWorldButton.onclick = (() => {
                getWorldData();
                
            });
    
            function getWorldData() {
                log("Please, write the world name:");
                runButton.onclick = (() => {
                    if (command.value == null || command.value == "") {
                        log("World name mustn't be empty!");
                    }
                    else {
                        log("Set name: " + command.value);
                        resetCommand();
    
                        let name = command.value;
                        getWorldSeed(name);
                    }
                });
            }
    
            function getWorldSeed(name) {
                log("Please, write a seed (number), or leave empty for random seed.");
                runButton.onclick = (() => {
                    if (isNaN(Number(command.value))) {
                        log("Seed must be a number")
                    }
                    else if (command.value == null || command.value == "") {
                        let seed = Math.floor(Math.random() * 10000000)
                        log("Set seed: " + seed);
                        resetCommand();
                        worldgen(name, seed);
                    }
                    else {
                        log("Set seed: " + command.value);
                        resetCommand();
                        worldgen(name, seed);
                    }
                });
            }
    
            function log(message) {
                let date = new Date()
                command.value = "";
                terminal.innerHTML += `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] > ${message} <br>`;
            }
    
            function resetCommand() {
                runButton.onclick = (() => {return null});
            }
    
    */

}
