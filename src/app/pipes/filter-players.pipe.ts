import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player.model';

function normalize(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
@Pipe({
  name: 'filterPlayers',
  standalone: true
})
export class FilterPlayersPipe implements PipeTransform {
  /**
   * @param players lista completa de jugadores
   * @param text texto a bucar en nombre y apellidos ('' = sin filtro)
   * @param position posición exacta ('' = todas)
   */
  transform(
    players: Player[] | null | undefined,
    text: string | null = '',
    position: string | null = ''
  ): Player[] {
    if (!players) {
      return [];
    }

    const query = normalize(text);
    const pos = normalize(position);

    return players?.filter(player => {
      const matchesText = !query || normalize(`${player.nombre} ${player.apellidos}`).includes(query);
      const matchesPosition = !pos || normalize(player.posicion) === pos;
      return matchesText && matchesPosition; 
    });
  }
}
