export interface Entity {
    entity: any,
    src: string,
    position: {
        position: 'absolute',
        left: string,
        top: string,
        display?: string
    },
    life?: any,
    x?: number,
    y?: number
}