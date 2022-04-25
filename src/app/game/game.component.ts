import { Component} from '@angular/core';
import { map, Observable } from 'rxjs';
import { Square } from '../interfaces/square';
import { SnakeService } from '../services/snake.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  grid$!: Observable<Square[]>;

  constructor(private game: SnakeService) { 
    this.grid$ = this.game.getSnake().pipe(
      map(game => game.grid)
    )
  }

  moveSnake() {
    this.game.moveSnake();
  }
}
