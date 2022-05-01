import { ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
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
  width = window.innerWidth;

  constructor(private game: SnakeService) { 
    this.game$ = this.game.getSnake();
    this.grid$ = this.game$.pipe(
      map(game => game.grid)
    )
  }

  stopGame() {
    this.game.stopGame();
  }

  newGame() {
    this.game.newGame();
  }

  startGame(level: string) {
    this.game.startGame(level);
  }

  moveSnake(direction: string) {
    this.game.updateDirection(direction);
  }

  back() {
    this.game.back();
  }

  showControls() {
    this.game.showControls();
  }
}
