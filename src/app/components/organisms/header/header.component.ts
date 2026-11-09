import { Component, Input } from '@angular/core';
import { LogoComponent } from '../../atoms/logo/logo.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { NavbarComponent } from '../../molecules/navbar/navbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, BadgeComponent, NavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() nombreEquipo = 'EQUIPO BASKET';
  @Input() temporada = '2026 / 2027';
}
