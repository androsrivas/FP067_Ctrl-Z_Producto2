import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersListComponent } from './players-list.component';

describe('PlayersListComponent', () => {
  let component: PlayersListComponent;
  let fixture: ComponentFixture<PlayersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filtra por texto', () => {
    component.searchText = 'diego';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-player-card').length).toBe(1);
  });

  it('muestra mensaje si no hay coincidencias', () => {
    component.searchText = 'zzzzzzzzz';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-player-card').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('No hay jugadores');
  });
});
