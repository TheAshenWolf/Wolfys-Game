export interface Entity {
    src: string,
    position: {
        position: 'absolute',
        left: string,
        top: string,
        display?: string
    },
    life?: any
}