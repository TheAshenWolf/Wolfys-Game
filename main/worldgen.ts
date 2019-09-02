import { World } from "../types/world.interface";
import * as math from "math-js";
import * as fs from "fs";


export class Worldgen{

    private world: World

    constructor() {}

    public createWorld(worldName: string): void {
        this.world.seed = math.random(-2147483648,2147483647);
        this.world.worldName = worldName;
        this.world.createdAt = new Date(Date.now());
        this.world.collectedLootboxes = [];
    }

    public saveWorld(saveName: string): void {
        console.log("Saving World...");
        fs.writeFile("../saves/" + saveName + ".json", this.world, (err) => {
            if(err) console.error(err);
            console.log("World saved!");
        });
    }

    public loadWorld(saveName: string): void {
        console.log("Loading World...");
        fs.readFile("../saves/" + saveName + ".json", (err, data) => {
            if(err) console.error(err);
            this.world = JSON.parse(JSON.stringify(data));
            console.log("World loaded!");
        })
    }



}