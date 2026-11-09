import { Component } from '@angular/core';
import { PlayersListComponent } from '../../components/organisms/players-list/players-list.component';
import { PlayerDetailComponent } from '../../components/organisms/player-detail/player-detail.component';
import { PlayerMediaComponent } from '../../components/organisms/player-media/player-media.component';
import { Player } from '../../models/player.model';
import { TeamLayoutComponent } from '../../components/templates/team-layout/team-layout.component';
import { PLAYERS_DATA } from '../../data/players.mock';
import { FilterBarComponent } from '../../components/molecules/filter-bar/filter-bar.component';
import { BadgeComponent } from '../../components/atoms/badge/badge.component';
import { FilterPlayersPipe } from '../../pipes/filter-players.pipe';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    TeamLayoutComponent,
    FilterBarComponent,
    BadgeComponent,
    PlayersListComponent,
    PlayerDetailComponent,
    PlayerMediaComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent {
  selectedPlayer: Player | null = null;
  searchText = '';
  sortBy = 'position';

  private readonly filterPipe = new FilterPlayersPipe();

  private readonly sortLabels: Record<string, string> = {
    position: 'posición',
    name: 'nombre',
    age: 'edad'
  };

  get sortLabel(): string {
    return this.sortLabels[this.sortBy] ?? '';
  }

  get totalJugadores(): number {
    return PLAYERS_DATA.length;
  }

  get totalFiltrados(): number {
    return this.filterPipe.transform(PLAYERS_DATA, this.searchText).length;
  }
}
