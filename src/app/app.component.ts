import { Component, HostListener } from '@angular/core';
import { SnakeService } from './services/snake.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private game: SnakeService) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let direction = ""; 
    console.log(event);
    switch(event.key.toLowerCase()) {
      case "w":
        direction = "up";
        break;
      case "a":
        direction = "left"
        break
      case "s":
        direction = "down";
        break;
      case "d":
        direction = "right"
        break
    }
    this.game.updateDirection(direction);
  }
}
