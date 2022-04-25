import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Square } from '../interfaces/square';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

  @Input() square!: Square;

  constructor() { }

  ngOnInit(): void {
  }
}
