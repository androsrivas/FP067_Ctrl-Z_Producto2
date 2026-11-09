import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerCardComponent } from '../../molecules/player-card/player-card.component';
import { Player } from '../../../models/player.model';
import { PLAYERS_DATA } from '../../../data/players.mock';
import { FilterPlayersPipe } from '../../../pipes/filter-players.pipe';
import { SortPlayersPipe } from '../../../pipes/sort-players.pipe';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [NgFor, NgIf, PlayerCardComponent, FilterPlayersPipe, SortPlayersPipe],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.css'
})
export class PlayersListComponent {
  players: Player[] = PLAYERS_DATA;

  @Input() searchText = '';
  @Input() position = '';
  @Input() sortBy = 'position';
  @Input() selectedId: number | null = null;
  @Output() playerSelected = new EventEmitter<Player>();


  select(player: Player): void {
    this.playerSelected.emit(player);
  }

  trackById(_: number, player: Player): number {
    return player.id;
  }
}
