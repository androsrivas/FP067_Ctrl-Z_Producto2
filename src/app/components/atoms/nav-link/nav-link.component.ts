import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [],
  templateUrl: './nav-link.component.html',
  styleUrl: './nav-link.component.css'
})
export class NavLinkComponent {
  @Input({ required: true}) label!: string;
  @Input() active = false;
  @Output() linkClick = new EventEmitter<string>(); 
}
