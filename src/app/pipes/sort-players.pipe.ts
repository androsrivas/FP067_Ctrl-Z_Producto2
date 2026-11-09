import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player.model';

const POISITION_ORDER = ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'];

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}

function positionRank(player: Player): number {
  const index = POISITION_ORDER.indexOf(normalize(player.posicion));
  return index === -1 ? POISITION_ORDER.length : index;
}

@Pipe({
  name: 'sortPlayers',
  standalone: true,
})
export class SortPlayersPipe implements PipeTransform {
  transform(players: Player[] | null | undefined, sortBy: string = 'position'): Player[] {
    if (!players) return [];

    const sorted = [...players];

    switch(sortBy) {
      case 'name':
        return sorted.sort((a, b) => 
        `${a.nombre} ${a.apellidos}`.localeCompare(`${b.nombre} ${b.apellidos}`, 'es'));
      case 'age':
        return sorted.sort((a, b) => a.edad - b.edad || a.dorsal - b.dorsal);
      case 'position':
      default:
        return sorted.sort((a, b) => positionRank(a) - positionRank(b) || a.dorsal - b.dorsal);
    }
  }
}
