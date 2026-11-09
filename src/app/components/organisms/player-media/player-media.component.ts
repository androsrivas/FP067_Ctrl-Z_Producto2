import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/player.model';

@Component({
  selector: 'app-player-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-media.component.html',
  styleUrls: ['./player-media.component.css'],
})
export class PlayerMediaComponent implements OnChanges {
  @Input() player: Player | null = null;
  @Input() totalVideos = 0;
  @Input() descripcion = '';

  playing = false;

  ngOnChanges(): void {
    this.playing = false; // al cambiar de jugador vuelve el placeholder
  }

  onPlay(): void {
    this.playing = true;
  }
}