import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../../models/player.model';
import { NgIf } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [NgIf, ButtonComponent],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  @Input({ required: true }) player!: Player;
  @Input() selected: boolean = false;
  @Output() cardClick = new EventEmitter<Player>();
}
