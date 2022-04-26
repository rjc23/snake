import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Data, Square } from '../interfaces/square';

@Injectable({
  providedIn: 'root'
})
export class SnakeService {

  private grid: BehaviorSubject<Square>[] = [];

  constructor() { 
    this.createGrid();
  }

  private data!: BehaviorSubject<Data>;
  
  createGrid() {
    const game: Data = {
      direction: "down",
      speed: 1,
      snake: [ 45, 46, 47 ]
    }
    this.data = new BehaviorSubject<Data>(game);

    for (let key = 0; key < 100; key++) {
      const square: Square = {
        key: key,
        fill: key === 45 || key === 46 || key == 47 ? true : false,
        food: false
      }
      const subj = new BehaviorSubject<Square>(square)
      this.grid.push(subj);
    }
  }

  getGrid() : Array<Observable<Square>> {
    return this.grid;
  }

  moveSnake() {
    let square = this.grid[22].value;
    square.fill = true;

    this.grid[22].next(square);
  }

  // private game = new BehaviorSubject<Game>(this.createGame());

  // getSnake(): Observable<Game> {
  //   return this.game;
  // }

  // createGame(): Game {
  //   let game: Game = {
  //     data: {
  //       direction: "down",
  //       speed: 1,
  //       snake: [ 45, 46, 47 ]
  //     },
  //     grid: []
  //   }

  //   for (let row = 0; row < 100; row++) {
  //     const square: Square = {
  //       key: row,
  //       fill: row === 45 || row === 46 || row == 47 ? true : false,
  //       food: false
  //     }
  //     game.grid.push(square);
  //   }
  //   return game;
  // }

  // moveSnake() {
  //   let currentGame = this.game.value;
  //   const frontIndex = currentGame.data.snake[0];
  //   const endIndex = currentGame.data.snake[currentGame.data.snake.length-1];
  //   const snake = currentGame.data.snake;

  //   // Update next square
  //   switch (currentGame.data.direction) {
  //     case "left":
  //       currentGame.grid[frontIndex-1].fill = true;
  //       snake.splice(0, 0, frontIndex-1);
  //       break;
  //     case "right":
  //       currentGame.grid[frontIndex+1].fill = true;
  //       snake.splice(0, 0, frontIndex+1);
  //       break;
  //     case "up":
  //       currentGame.grid[frontIndex-10].fill = true;
  //       snake.splice(0, 0, frontIndex-10);
  //       break;
  //     case "down":
  //       currentGame.grid[frontIndex+10].fill = true;
  //       snake.splice(0, 0, frontIndex+10);
  //       break;
  //   }

  //   // Clear the last square of snake
  //   currentGame.grid[endIndex].fill = false;
  //   currentGame.data.snake.pop();
  //   this.game.next(currentGame);
  // }
}
