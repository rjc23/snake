import { ChangeDetectionStrategy, Component, DoCheck, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Square } from '../interfaces/square';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, DoCheck {

  @Input() square$!: Observable<Square>;

  constructor() { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    console.log('component checked');
  }
}
