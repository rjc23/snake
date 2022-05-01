export interface Game {
    data: Data,
    grid: Square[]
}

interface Data {
    direction: string[],
    snake: number[],
    foodLocation: number,
    difficulty: string,
    score: number,
    highScore: number,
    showWelcome: boolean,
    showGame: boolean,
    showYouDied: boolean,
    showRules: boolean
}

export interface Square {
    key: number
    fill: boolean,
    food: boolean,
    bounds: string[]
}