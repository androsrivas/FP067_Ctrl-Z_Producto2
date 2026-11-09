import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.css'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth: boolean = true;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
