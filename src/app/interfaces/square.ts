export interface Game {
    data: Data,
    grid: Square[]
}

interface Data {
    direction: string,
    speed: number,
    snake: number[]
}

export interface Square {
    key: number
    fill: boolean,
    food: boolean
}