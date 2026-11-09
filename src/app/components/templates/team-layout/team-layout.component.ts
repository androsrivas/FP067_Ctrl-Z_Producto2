import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../organisms/header/header.component';
import { FooterComponent } from '../../organisms/footer/footer.component';

@Component({
  selector: 'app-team-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './team-layout.component.html',
  styleUrl: './team-layout.component.css'
})
export class TeamLayoutComponent {
  @Input() nombreEquipo = 'EQUIPO BASKET';
  @Input() temporada = '2026 / 2027';
}
