import { environment } from 'src/environments/environment';

const Spells = {
    fireball: {
        cost: 25,
        damage: 50,
        type: 'projectile',
        src: environment.assets + 'spells/fireball-',
        endSrc: environment.assets + 'spells/fire-splash-',
        fileType: '.png'
    }
}

export default Spells;