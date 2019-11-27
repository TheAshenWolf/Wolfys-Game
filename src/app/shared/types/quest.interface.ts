export interface Quest {
    task: string,
    target: string,
    amount: number,
    current: number,
    reward: {
        xp: number,
        gold: number
    }
}