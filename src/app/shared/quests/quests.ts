/*{
    task: ,
    target: ,
    amount: ,
    current: 0,
    reward: {
        xp: ,
        gold: 
    },
    text: 
}
*/

const Quests = {
    easy: [
        {
            task: 'collect',
            target: 'herbRed',
            amount: 5,
            current: 0,
            reward: {
                xp: 25,
                gold: 10
            },
            text: 'Collect five red herbs.'
        },
        {
            task: 'collect',
            target: 'herbBlue',
            amount: 5,
            current: 0,
            reward: {
                xp: 25,
                gold: 10
            },
            text: 'Collect five blue herbs.'
        },
        {
            task: 'kill',
            target: 'bunny',
            amount: 2,
            current: 0,
            reward: {
                xp: 25,
                gold: 10
            },
            text: 'Kill two bunnies.'
        }
    ],
    normal: [
        {
            task: 'kill',
            target: 'bunny',
            amount: 10,
            current: 0,
            reward: {
                xp: 100,
                gold: 50
            },
            text: 'Kill ten bunnies.'
        }
    ],
    hard: [
        {
            task: 'kill',
            target: 'spider',
            amount: 5,
            current: 0,
            reward: {
                xp: 200,
                gold: 150
            },
            text: 'Kill five spiders.'
        }
    ]
}

export default Quests;