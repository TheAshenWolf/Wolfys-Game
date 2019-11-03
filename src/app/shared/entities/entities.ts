const entityBehavior = {
    shy: () => {
        // running away from a player
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