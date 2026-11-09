import { FilterPlayersPipe } from './filter-players.pipe';
import { PLAYERS_DATA } from '../data/players.mock';

describe('FilterPlayersPipe', () => {
  const pipe = new FilterPlayersPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('devuelve todos si no hay filtros', () => {
    expect(pipe.transform(PLAYERS_DATA, '', '').length).toBe(PLAYERS_DATA.length);
  });

  it('filtra por nombre ignorando mayúsculas y tildes', () => {
    const result = pipe.transform(PLAYERS_DATA, 'ALVARO', '');
    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe('Álvaro');
  });

  it('filtra por apellidos', () => {
    const result = pipe.transform(PLAYERS_DATA, 'torres', '');
    expect(result.map(p => p.apellidos)).toEqual(['Torres']);
  });

  it('filtra por posición', () => {
    const result = pipe.transform(PLAYERS_DATA, '', 'Base');
    expect(result.every(p => p.posicion === 'Base')).toBeTrue();
    expect(result.length).toBeGreaterThan(0);
  });

  it('combina texto y posición', () => {
    expect(pipe.transform(PLAYERS_DATA, 'diego', 'Base')).toEqual([]);
    expect(pipe.transform(PLAYERS_DATA, 'diego', 'Escolta').length).toBe(1);
  });

  it('devuelve [] si la lista es null o undefined', () => {
    expect(pipe.transform(null, 'a', '')).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });

  it('no modifica el array original', () => {
    const copy = [...PLAYERS_DATA];
    pipe.transform(PLAYERS_DATA, 'a', 'Base');
    expect(PLAYERS_DATA).toEqual(copy);
  });
});