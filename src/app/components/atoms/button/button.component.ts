import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'accent' | 'icon-danger';

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
  @Input() variant: ButtonVariant = 'accent';
  @Input() ariaLabel?: string;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
