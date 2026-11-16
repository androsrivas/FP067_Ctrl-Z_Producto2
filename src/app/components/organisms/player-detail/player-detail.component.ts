import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/player.model';
import { PlayerMediaComponent } from '../player-media/player-media.component';
import { StatCardComponent } from '../../atoms/stat-card/stat-card.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../../../services/player.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PlayerMediaComponent,
    StatCardComponent,
  ],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent {
  @Input() player: Player | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly playerService = inject(PlayerService);

  editing = false;
  saving = false;
  message: { type: 'success' | 'danger'; text: string } | null = null;

  readonly posiciones = ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'];

  readonly textFields = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'apellidos', label: 'Apellidos' },
    { name: 'nacionalidad', label: 'Nacionalidad' },
    { name: 'foto', label: 'Foto (ruta o URL)' },
    { name: 'videoUrl', label: 'Vídeo (ruta o URL)' },
  ];

  readonly numberFields = [
    { name: 'dorsal', label: 'Dorsal', step: 1, error: 'Entre 0 y 99.' },
    { name: 'edad', label: 'Edad', step: 1, error: 'Entre 15 y 50.' },
    { name: 'altura', label: 'Altura (m)', step: 0.01, error: 'Entre 1 y 2,5m.' },
    { name: 'puntos', label: 'Puntos', step: 0.1, error: 'Debe ser 0 o más.' },
    { name: 'asistencias', label: 'Asistencias', step: 0.1, error: 'Debe ser 0 o más.' },
    { name: 'rebotes', label: 'Rebotes', step: 0.1, error: 'Debe ser 0 o más.' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dorsal: [0, [Validators.required, Validators.min(0), Validators.max(99)]],
    posicion: ['', Validators.required],
    edad: [0, [Validators.required, Validators.min(15), Validators.max(50)]],
    altura: [0, [Validators.required, Validators.min(1), Validators.max(2.5)]],
    nacionalidad: ['', Validators.required],
    puntos: [0, [Validators.required, Validators.min(0)]],
    asistencias: [0, [Validators.required, Validators.min(0)]],
    rebotes: [0, [Validators.required, Validators.min(0)]],
    biografia: [''],
    foto: ['', Validators.required],
    videoUrl: [''],
  });

  get personalInfo(): { label: string; value: string | number }[] {
    if (!this.player) return [];
    return [
      { label: 'Edad', value: this.player.edad },
      { label: 'Altura', value: this.player.altura },
      { label: 'Nacionalidad', value: this.player.nacionalidad },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['player'];
    if (change && change.previousValue?.id !== change.currentValue?.id) {
      this.editing = false;
      this.message = null;
    }
  }

  startEdit(): void {
    if (!this.player) return;
    this.form.reset(this.player);
    this.message = null;
    this.editing = true;
  }

  cancel(): void {
    this.editing = false;
  }

  isInvalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  async save(): Promise<void> {
    if (!this.player?.firebaseId) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      await this.playerService.updatePlayer(this.player.firebaseId, this.form.getRawValue() as Partial<Player>);
      this.editing = false;
      this.message = { type: 'success', text: 'Jugador actualizado correctamente.' };
    } catch (error) {
      console.error(error);
      this.message = { type: 'danger', text: 'No se ha podido guardar. Inténtalo de nuevo.' };
    } finally {
      this.saving = false;
    }
  }

  close(): void {
    this.closed.emit();
  }
}
