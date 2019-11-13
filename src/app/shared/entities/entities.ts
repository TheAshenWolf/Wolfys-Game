import { environment } from 'src/environments/environment';

export const Bunny = {
    x: 0,
    y: 0,
    health: 50,
    src: environment.assets + 'entities/bunny-',
    fileType: '.png',
    visionRadius: 5,
    rotation: 'left',
    entityBehavior: null
}