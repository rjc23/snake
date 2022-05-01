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

  startGame(difficulty: string) {
    let game = this.game.value;
    game.data.showGame = true;
    game.data.showWelcome = false;
    game.data.difficulty = difficulty;
    this.game.next(game);
    this.addFood(0);

    let source: any;
    switch (difficulty) {
      case "easy":
        source = interval(200);
        break;
      case "hard":
        source = interval(100);
        break;
      case "insane":
        source = interval(50);
        break;
    };
    
    this.subscription = source.subscribe(() => this.moveSnake());
  }

  stopGame() {
    let game = this.game.value;
    game.data.showYouDied = true;
    if(game.data.score > game.data.highScore) {
      game.data.highScore = game.data.score;
      localStorage.setItem("highScore", game.data.highScore.toString());
    }
    this.game.next(game);
    this.subscription.unsubscribe();
  }

  newGame() {
    this.game.next(this.createGame())
  }

  createGame(): Game {
    let highScore = 0;
    let highStorage = localStorage.getItem("highScore");
    if(highStorage) {
      highScore = parseInt(highStorage);
    }

    let game: Game = {
      data: {
        direction: ["left"],
        snake: [ 137, 138, 139 ],
        foodLocation: 137,
        difficulty: "easy",
        score: 0,
        highScore: highScore,
        showWelcome: true,
        showGame: false,
        showYouDied: false,
        showRules: false
      },
      grid: []
    }

    for (let row = 0; row < 300; row++) {
      const square: Square = {
        key: row,
        fill: row === 137 || row === 138 || row == 139 ? true : false,
        food: false,
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
      if(updateDir && direction !== currentDirection[currentDirection.length-1]) {
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

    switch(currentGame.data.difficulty) {
      case "easy":
        currentGame.data.score++;
        break;
      case "hard":
        currentGame.data.score += 5;
        break;
      case "insane":
        currentGame.data.score += 10;
    }
    this.game.next(currentGame);
  }

  showControls() {
    let currentGame = this.game.value;
    currentGame.data.showRules = true;
    currentGame.data.showWelcome = false;
    this.game.next(currentGame);
  }

  back() {
    let currentGame = this.game.value;
    currentGame.data.showWelcome = true;
    currentGame.data.showRules = false;
    this.game.next(currentGame);
  }
}
