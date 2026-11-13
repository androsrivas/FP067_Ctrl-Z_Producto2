import { Component, inject } from '@angular/core';

import { PlayersListComponent } from '../../components/organisms/players-list/players-list.component';
import { PlayerDetailComponent } from '../../components/organisms/player-detail/player-detail.component';
import { PlayerMediaComponent } from '../../components/organisms/player-media/player-media.component';

import { TeamLayoutComponent } from '../../components/templates/team-layout/team-layout.component';
import { FilterBarComponent } from '../../components/molecules/filter-bar/filter-bar.component';
import { BadgeComponent } from '../../components/atoms/badge/badge.component';

import { FilterPlayersPipe } from '../../pipes/filter-players.pipe';

import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';

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
  players: Player[] = [];

  searchText = '';
  sortBy = 'position';

  private readonly playerService = inject(PlayerService);
  private readonly filterPipe = new FilterPlayersPipe();

  private readonly sortLabels: Record<string, string> = {
    position: 'posición',
    name: 'nombre',
    age: 'edad'
  };

  constructor() {
  this.playerService.getPlayers().subscribe((players: Player[]) => {

    players.forEach(player => {
      console.log(
        'ID:',
        player.id,
        'NOMBRE:',
        player.nombre,
        'APELLIDOS:',
        player.apellidos,
        'DORSAL:',
        player.dorsal
      );
    });

    this.players = players;
  });
}

deletePlayer(player: Player): void {

  const confirmed = confirm(
    `¿Seguro que deseas eliminar a ${player.nombre} ${player.apellidos}?`
  );

  if (!confirmed) {
    return;
  }

  console.log('Eliminar jugador:', player);
}

  get sortLabel(): string {
    return this.sortLabels[this.sortBy] ?? '';
  }

  get totalJugadores(): number {
    return this.players.length;
  }

  get totalFiltrados(): number {
    return this.filterPipe.transform(
      this.players,
      this.searchText
    ).length;
  }
}