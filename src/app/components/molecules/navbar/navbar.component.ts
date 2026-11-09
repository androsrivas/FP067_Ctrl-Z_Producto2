import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavLinkComponent } from '../../atoms/nav-link/nav-link.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor, NavLinkComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() items: string[] = ['Plantilla', 'Partidos', 'Estadística'];
  @Input() active = 'Plantilla';
  @Output() itemSelected = new EventEmitter<string>();

  select(item: string): void {
    this.active = item;
    this.itemSelected.emit(item);
  }
}
