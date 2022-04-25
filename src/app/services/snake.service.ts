import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game, Square } from '../interfaces/square';

@Injectable({
  providedIn: 'root'
})
export class SnakeService {

  constructor() { }

  private game = new BehaviorSubject<Game>(this.createGame());

  getSnake(): Observable<Game> {
    return this.game;
  }

  createGame(): Game {
    let game: Game = {
      data: {
        direction: "down",
        speed: 1,
        snake: [ 45, 46, 47 ]
      },
      grid: []
    }

    for (let row = 0; row < 100; row++) {
      const square: Square = {
        key: row,
        fill: row === 45 || row === 46 || row == 47 ? true : false,
        food: false
      }
      game.grid.push(square);
    }
    return game;
  }

  moveSnake() {
    let currentGame = this.game.value;
    const frontIndex = currentGame.data.snake[0];
    const endIndex = currentGame.data.snake[currentGame.data.snake.length-1];
    const snake = currentGame.data.snake;

    // Update next square
    switch (currentGame.data.direction) {
      case "left":
        currentGame.grid[frontIndex-1].fill = true;
        snake.splice(0, 0, frontIndex-1);
        break;
      case "right":
        currentGame.grid[frontIndex+1].fill = true;
        snake.splice(0, 0, frontIndex+1);
        break;
      case "up":
        currentGame.grid[frontIndex-10].fill = true;
        snake.splice(0, 0, frontIndex-10);
        break;
      case "down":
        currentGame.grid[frontIndex+10].fill = true;
        snake.splice(0, 0, frontIndex+10);
        break;
    }

    // Clear the last square of snake
    currentGame.grid[endIndex].fill = false;
    currentGame.data.snake.pop();
    this.game.next(currentGame);
  }
}
