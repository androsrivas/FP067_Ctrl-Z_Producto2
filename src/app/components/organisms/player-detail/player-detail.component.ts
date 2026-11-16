import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../models/player.model';
import { ButtonComponent } from '../../atoms/button/button.component';
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
    ButtonComponent,
    PlayerMediaComponent,
    StatCardComponent,
  ],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent {
  @Input() player: Player | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<Player>();

  private readonly fb = inject(FormBuilder);
  private readonly playerService = inject(PlayerService);

  editing = false;
  saving = false;
  message: { type: 'success' | 'danger'; text: string } | null = null;

  imageFile: File | null = null;
  videoFile: File | null = null;
  fileError: string | null = null;

  private readonly fileLimits = {
    image: { type: 'image/', maxMb: 5, label: 'La imagen' },
    video: { type: 'video/', maxMb: 50, label: 'El vídeo' },
  };

  readonly posiciones = ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'];

  readonly textFields = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'apellidos', label: 'Apellidos' },
    { name: 'nacionalidad', label: 'Nacionalidad' },
  ];

  readonly numberFields = [
    { name: 'dorsal', label: 'Dorsal', step: 1, error: 'Entre 0 y 99.' },
    { name: 'edad', label: 'Edad', step: 1, error: 'Entre 15 y 50.' },
    {
      name: 'altura',
      label: 'Altura (m)',
      step: 0.01,
      error: 'Entre 1 y 2,5m.',
    },
    { name: 'puntos', label: 'Puntos', step: 0.1, error: 'Debe ser 0 o más.' },
    {
      name: 'asistencias',
      label: 'Asistencias',
      step: 0.1,
      error: 'Debe ser 0 o más.',
    },
    {
      name: 'rebotes',
      label: 'Rebotes',
      step: 0.1,
      error: 'Debe ser 0 o más.',
    },
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
    this.resetFiles();
    this.message = null;
    this.editing = true;
  }

  cancel(): void {
    this.resetFiles();
    this.editing = false;
  }

  private resetFiles(): void {
    this.imageFile = null;
    this.videoFile = null;
    this.fileError = null;
  }

  isInvalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  async save(): Promise<void> {
    if (!this.player?.firebaseId) return;

    if (this.form.invalid || this.fileError) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      const data = this.form.getRawValue() as Partial<Player>;

      // Primero subimos los archivos a Storage y guardamos la URL en el formulario
      if (this.imageFile) {
        data.foto = await this.playerService.uploadFile(this.imageFile, 'images');
      }
      if (this.videoFile) {
        data.videoUrl = await this.playerService.uploadFile(this.videoFile, 'videos');
      }

      //Luego guardaos todos los datos (con las URL nuevas) en Firestore
      await this.playerService.updatePlayer(
        this.player.firebaseId,
        data
      );
      this.resetFiles();
      this.editing = false;
      this.message = {
        type: 'success',
        text: 'Jugador actualizado correctamente.',
      };
    } catch (error) {
      console.error(error);
      this.message = {
        type: 'danger',
        text: 'No se ha podido guardar. Inténtalo de nuevo.',
      };
    } finally {
      this.saving = false;
    }
  }

  onFileSelected(event: Event, kind: 'image' | 'video'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError = null;

    if (file) {
      const { type, maxMb, label } = this.fileLimits[kind];
      if (!file.type.startsWith(type) || file.size >= maxMb * 1024 * 1024) {
        this.fileError = `${label} debe ser un archivo ${type}* de menos de ${maxMb} MB.`;
        input.value = '';
        this.setFile(kind, null);
        return;
      }
    }
    this.setFile(kind, file);
  }

  private setFile(kind: 'image' | 'video', file: File | null): void {
    if (kind === 'image') this.imageFile = file;
    else this.videoFile = file;
  }

  close(): void {
    this.closed.emit();
  }
}
