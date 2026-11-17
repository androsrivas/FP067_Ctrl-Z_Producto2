import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Player } from '../../../models/player.model';
import { InputComponent } from '../../atoms/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

export interface PlayerFormResult {
  data: Partial<Player>;
  imageFile: File | null;
  videoFile: File | null;
}

type FileKind = 'image' | 'video';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css',
})
export class PlayerFormComponent implements OnChanges {
  /** null = crear; un Player = editar (rellena el formulario) */
  @Input() initial: Player | null = null;
  @Input() requirePhoto = false;
  @Input() saving = false;
  @Input() submitLabel = 'Guardar';
  @Input() idPrefix = 'player';

  @Output() formSubmit = new EventEmitter<PlayerFormResult>();
  @Output() formCancel = new EventEmitter<void>();

  @ViewChild('formEl') formEl?: ElementRef<HTMLFormElement>;

  private readonly fb = inject(FormBuilder);

  readonly posiciones = ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'];

  readonly textFields = [
    { name: 'nombre', label: 'Nombre', col: 'col-6' },
    { name: 'apellidos', label: 'Apellidos', col: 'col-6' },
    { name: 'nacionalidad', label: 'Nacionalidad', col: 'col-6' },
  ];

  readonly numberFields = [
    {
      name: 'dorsal',
      label: 'Dorsal',
      step: 1,
      error: 'Entre 0 y 99.',
      col: 'col-6',
    },
    {
      name: 'edad',
      label: 'Edad',
      step: 1,
      error: 'Entre 15 y 50.',
      col: 'col-6',
    },
    {
      name: 'altura',
      label: 'Altura (m)',
      step: 0.01,
      error: 'Entre 1 y 2,5 m.',
      col: 'col-6',
    },
    {
      name: 'puntos',
      label: 'Puntos',
      step: 0.1,
      error: 'Debe ser 0 o más.',
      col: 'col-4',
    },
    {
      name: 'asistencias',
      label: 'Asistencias',
      step: 0.1,
      error: 'Debe ser 0 o más.',
      col: 'col-4'
    },
    {
      name: 'rebotes',
      label: 'Rebotes',
      step: 0.1,
      error: 'Debe ser 0 o más.',
      col: 'col-4'
    },
  ];

  private readonly fileLimits = {
    image: { type: 'image/', maxMb: 5, label: 'La imagen' },
    video: { type: 'video/', maxMb: 50, label: 'El vídeo' },
  };

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dorsal: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(99)],
    ],
    posicion: ['', Validators.required],
    edad: [
      null as number | null,
      [Validators.required, Validators.min(15), Validators.max(50)],
    ],
    altura: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.max(2.5)],
    ],
    nacionalidad: ['', Validators.required],
    puntos: [null as number | null, [Validators.required, Validators.min(0)]],
    asistencias: [
      null as number | null,
      [Validators.required, Validators.min(0)],
    ],
    rebotes: [null as number | null, [Validators.required, Validators.min(0)]],
    biografia: [''],
    foto: [''],
    videoUrl: [''],
  });

  imageFile: File | null = null;
  videoFile: File | null = null;
  fileError: string | null = null;
  triedSubmit = false;

  ngOnChanges(changes: SimpleChanges): void {
    const c = changes['initial'];
    // Solo reseteamos si cambia de jugador (no en cada emisión de Firestore del mismo)
    if (c && (c.firstChange || c.previousValue?.id !== c.currentValue?.id)) {
      this.reset();
    }
  }

  get photoMissing(): boolean {
    return this.triedSubmit && this.requirePhoto && !this.imageFile;
  }

  get hasFiles(): boolean {
    return !!(this.imageFile || this.videoFile);
  }

  isInvalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  onFileSelected(event: Event, kind: FileKind): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError = null;

    if (file) {
      const { type, maxMb, label } = this.fileLimits[kind];
      if (!file.type.startsWith(type) || file.size >= maxMb * 1024 * 1024) {
        this.fileError = `${label} debe ser un archivo ${type}* de menos de ${maxMb} MB.`;
        input.value = '';
      }
    }

    const accepted = this.fileError ? null : file;
    if (kind === 'image') this.imageFile = accepted;
    else this.videoFile = accepted;
  }

  onSubmit(): void {
    this.triedSubmit = true;
    if (this.form.invalid || this.fileError || this.photoMissing) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit({
      data: this.form.getRawValue() as Partial<Player>,
      imageFile: this.imageFile,
      videoFile: this.videoFile,
    });
  }

  /** Público: el contenedor lo llama tras crear con éxito */
  reset(): void {
    this.formEl?.nativeElement.reset(); // limpia los <input type="file">
    if (this.initial) this.form.reset(this.initial);
    else this.form.reset();
    this.imageFile = null;
    this.videoFile = null;
    this.fileError = null;
    this.triedSubmit = false;
  }
}
