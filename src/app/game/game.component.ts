import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { interval, map, Observable, Subscription } from 'rxjs';
import { Game, Square } from '../interfaces/square';
import { SnakeService } from '../services/snake.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  game$!: Observable<Game>;
  grid$!: Observable<Square[]>;

  constructor(private game: SnakeService) { 
    this.game$ = this.game.getSnake();
    this.grid$ = this.game$.pipe(
      map(game => game.grid)
    )
  }

  moveSnake() {
    this.game.moveSnake();
  }

  // startGame() {
  //   this.game.startGame();
  // }

  stopGame() {
    this.game.stopGame();
  }

  newGame() {
    this.game.newGame();
  }

  startEasy() {
    this.game.startGame(300);
  }

  startHard() {

  }

  startInsane() {

  }
}
