import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerCardComponent } from './player-card.component';
import { PLAYERS_DATA } from '../../../data/players.mock';

describe('PlayerCardComponent', () => {
  let component: PlayerCardComponent;
  let fixture: ComponentFixture<PlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PlayerCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(PlayerCardComponent);
    component = fixture.componentInstance;
    component.player = PLAYERS_DATA[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra nombre y posición', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain(PLAYERS_DATA[0].nombre);
    expect(text).toContain(PLAYERS_DATA[0].posicion);
  });

  it('emite el jugador al hacer clic', () => {
    spyOn(component.cardClick, 'emit');
    fixture.nativeElement.querySelector('.player-card').click();
    expect(component.cardClick.emit).toHaveBeenCalledWith(PLAYERS_DATA[0]);
  });

  it('aplica la clase selected', () => {
    component.selected = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.player-card').classList).toContain('selected');
  });
});