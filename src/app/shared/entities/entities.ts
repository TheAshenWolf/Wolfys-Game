import { environment } from 'src/environments/environment';

const Entities = {
    'bunny': {
        x: 0,
        y: 0,
        health: 50,
        src: environment.assets + 'entities/bunny-',
        fileType: '.png',
        visionRadius: 5,
        rotation: 'left',
        entityBehavior: null,
        expReward: 15,
        damage: 0
    },
    'spider': {
        x: 0,
        y: 0,
        health: 100,
        src: environment.assets + 'entities/spider-',
        fileType: '.png',
        visionRadius: 5,
        rotation: 'left',
        entityBehavior: null,
        expReward: 50,
        damage: 10
    }
}

export default Entities;