import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { Game, Square } from '../interfaces/square';

@Injectable({
  providedIn: 'root'
})
export class SnakeService {

  subscription!: Subscription;


  constructor() { }

  private game = new BehaviorSubject<Game>(this.createGame());
  directions = ["left", "right", "up", "down"]

  getSnake(): Observable<Game> {
    return this.game;
  }

  startGame(val: number) {
    let game = this.game.value;
    game.data.showGame = true;
    game.data.showWelcome = false;
    this.game.next(game);
    let source = interval(val);
    this.subscription = source.subscribe(val => this.moveSnake());
  }

  stopGame() {
    this.subscription.unsubscribe();
  }

  newGame() {
    this.game.next(this.createGame())
  }

  createGame(): Game {
    let game: Game = {
      data: {
        direction: ["left"],
        speed: 1,
        snake: [ 45, 46, 47 ],
        foodLocation: 20,
        score: 0,
        showWelcome: true,
        showGame: false
      },
      grid: []
    }

    for (let row = 0; row < 300; row++) {
      const square: Square = {
        key: row,
        fill: row === 45 || row === 46 || row == 47 ? true : false,
        food: row === 20 ? true : false,
        bounds: []
      }
      if(row < 20) {
        square.bounds.push("up")
      }
      if(row >= 280) {
        square.bounds.push("down")
      }
      if((row+1) % 20 === 0 && row !== 0) {
        square.bounds.push("right");
      }
      if(row % 20 === 0) {
        square.bounds.push("left")
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

    // Check if collision with wall
    if(currentGame.grid[frontIndex].bounds.length > 0) {
      for (let i = 0; i < currentGame.grid[frontIndex].bounds.length; i++) {
        if(currentGame.grid[frontIndex].bounds[i] === currentGame.data.direction[currentGame.data.direction.length-1]) {
          this.stopGame();
          return;
        }
      }
    }
    
    // Update next square
    currentGame.data.direction.length > 1 ? currentGame.data.direction.shift() : null;
    switch (currentGame.data.direction[0]) {
      case "left":
        currentGame.grid[frontIndex-1].fill = true;
        snake.splice(0, 0, frontIndex-1);
        break;
      case "right":
        currentGame.grid[frontIndex+1].fill = true;
        snake.splice(0, 0, frontIndex+1);
        break;
      case "up":
        currentGame.grid[frontIndex-20].fill = true;
        snake.splice(0, 0, frontIndex-20);
        break;
      case "down":
        currentGame.grid[frontIndex+20].fill = true;
        snake.splice(0, 0, frontIndex+20);
        break;
    }

    // Check if collision with itself
    if((new Set(snake)).size !== snake.length) {
      this.stopGame();
      return;
    }

    // Clear the last square of snake
    if(frontIndex !== currentGame.data.foodLocation) {
      currentGame.grid[endIndex].fill = false;
      currentGame.data.snake.pop();
    } else {
      this.addFood(frontIndex);
      this.updateScore();
    }
    this.game.next(currentGame);
  }

  updateDirection(direction: string) {
    if(this.directions.includes(direction)) {
      let currentGame = this.game.value;
      const currentDirection = currentGame.data.direction;
      let updateDir = true;
      // Check so does not move back on itself
      switch (direction) {
        case "left":
          currentDirection[currentDirection.length-1] === "right" ? updateDir = false : null;
          break;
        case "right":
          currentDirection[currentDirection.length-1] === "left" ? updateDir = false : null;
          break;
        case "up":
          currentDirection[currentDirection.length-1] === "down" ? updateDir = false : null;
          break;
        case "down":
          currentDirection[currentDirection.length-1] === "up" ? updateDir = false : null;
          break;
      }
      if(updateDir) {
        currentGame.data.direction.push(direction);
        this.game.next(currentGame);
      }
    }
  }

  addFood(frontIndex: number) {
    let currentGame = this.game.value;
    // Remove current food
    currentGame.grid[frontIndex].food = false;

    //Add new food
    let squares = Array.from(Array(300).keys());
    const snake = currentGame.data.snake;
    squares = squares.filter( el => !snake.includes( el ));
    const randomEl = squares[Math.floor(Math.random() * squares.length)];
    currentGame.grid[randomEl].food = true;
    currentGame.data.foodLocation = randomEl;
    this.game.next(currentGame);
  }

  updateScore() {
    let currentGame = this.game.value;
    currentGame.data.score++;
    this.game.next(currentGame);
  }
}
