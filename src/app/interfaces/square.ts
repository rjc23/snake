export interface Game {
    data: Data,
    grid: Square[]
}

interface Data {
    direction: string[],
    speed: number,
    snake: number[],
    foodLocation: number,
    score: number,
    showWelcome: boolean,
    showGame: boolean
}

export interface Square {
    key: number
    fill: boolean,
    food: boolean,
    bounds: string[]
}