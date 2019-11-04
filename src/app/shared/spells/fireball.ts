import { environment } from 'src/environments/environment';

export const fireball = {
    cost: 25,
    damage: 50,
    type: 'projectile',
    src: environment.assets + 'spells/fireball.png',
    endSrc: environment.assets + 'spells/fire-splash.png'
}