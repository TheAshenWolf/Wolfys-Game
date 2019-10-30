import { environment } from 'src/environments/environment'

const Items = {
    'herbRed': {
        name: 'Red Herb',
        quantity: 1,
        description: 'Use this herb to replenish 10 % of your max health.',
        icon: environment.assets + 'world/herbRed.png',
        use: function(f, args) {
            f(...args);
        }
    },
    'herbBlue': {
        name: 'Blue Herb',
        quantity: 1,
        description: 'Use this herb to replenish 10 % of your max mana.',
        icon: environment.assets + 'world/herbBlue.png',
        use: function(f, args) {
            f(...args);
        }
    }
}

export default Items;