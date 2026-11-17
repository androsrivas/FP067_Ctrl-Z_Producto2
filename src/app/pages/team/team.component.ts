import { Component, ViewChild, inject } from '@angular/core';

import { PlayersListComponent } from '../../components/organisms/players-list/players-list.component';
import { PlayerDetailComponent } from '../../components/organisms/player-detail/player-detail.component';
import { PlayerMediaComponent } from '../../components/organisms/player-media/player-media.component';
import { PlayerFormComponent, PlayerFormResult } from '../../components/organisms/player-form/player-form.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';

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
    ButtonComponent,
    PlayersListComponent,
    PlayerDetailComponent,
    PlayerMediaComponent,
    PlayerFormComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent {
  selectedId: number | null = null;
  creating = false;
  saving = false;
  createMessage: { type: 'success' | 'danger'; text: string } | null = null;

  @ViewChild(PlayerFormComponent) createForm?: PlayerFormComponent;
  
  players: Player[] = [];

  searchText = '';
  sortBy = 'position';
  positionFilter = '';

  private readonly playerService = inject(PlayerService);
  private readonly filterPipe = new FilterPlayersPipe();

  private readonly sortLabels: Record<string, string> = {
    position: 'posición',
    name: 'nombre',
    age: 'edad',
  };

  constructor() {
  this.playerService.getPlayers().subscribe((players: Player[]) => {
    this.players = players;
  });
}

get selectedPlayer(): Player | null {
  return this.players.find(p => p.id === this.selectedId) ?? null;
}

startCreate(): void {
  this.creating = true;
  this.selectedId = null;
  this.createMessage = null;
}

async createPlayer({ data, imageFile, videoFile}: PlayerFormResult): Promise<void> {
  if (!imageFile) return; // el form ya lo valida con requirePhoto
  this.createMessage = null;
  this.saving = true;
  try {
    // 1. subimos los archivos a Storage
    const foto = await this.playerService.uploadFile(imageFile, 'images');
    const videoUrl = videoFile ? await this.playerService.uploadFile(videoFile, 'videos') : '';

    // 2. creamos el documento en Firestore con las URL
    const player = { ...data, id: this.nextId, foto, videoUrl } as Player;
    await this.playerService.addPlayer(player);

    this.createMessage = {
      type: 'success',
      text: `${player.nombre} ${player.apellidos} se ha añadido a la plantilla.`,
    };
    this.createForm?.reset();
  } catch (error) {
    console.error('Error creando jugador:', error);
    this.createMessage = {
      type: 'danger',
      text: 'No se ha podido crear el jugador. Inténtalo de nuevo.'
    };
  } finally {
    this.saving = false;
  }
}

get nextId(): number {
  const ids = this.players.map(p => p.id);
  return Math.max(0, ...ids) + 1;
}

async deletePlayer(player: Player): Promise<void> {
  if (!player.firebaseId) return;

  const confirmed = confirm(
    `¿Seguro que deseas eliminar a ${player.nombre} ${player.apellidos}?`
  );
  if (!confirmed) return;

  try {
    await this.playerService.deletePlayer(player.firebaseId);
  } catch (error) {
    console.error('Error eliminando jugador:', error);
    alert('No se ha podido eliminar el jugador');
  }
}

  get sortLabel(): string {
    return this.sortLabels[this.sortBy] ?? '';
  }

  get totalJugadores(): number {
    return this.players.length;
  }

  get totalFiltrados(): number {
    return this.filterPipe.transform(this.players, this.searchText).length;
  }
}
