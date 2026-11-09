import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/player.model';
import { PlayerMediaComponent } from '../player-media/player-media.component';
import { StatCardComponent } from '../../atoms/stat-card/stat-card.component';


@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, PlayerMediaComponent, StatCardComponent],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent {
  @Input() player: Player | null = null;
  @Output() closed = new EventEmitter<void>();

  get personalInfo(): { label: string; value: string |number }[] {
    if (!this.player) return [];
    return [
      { label: 'Edad', value: this.player.edad },
      { label: 'Altura', value: this.player.altura },
      { label: 'Nacionalidad', value: this.player.nacionalidad }
    ]
  }

  close(): void {
    this.closed.emit();
  }
}