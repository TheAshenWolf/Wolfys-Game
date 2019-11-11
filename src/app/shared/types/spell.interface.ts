export interface Spell {
    src: string,
    position:{
        position: 'absolute',
        left: string,
        top: string,
        display?: string
    },
    life?: any
}