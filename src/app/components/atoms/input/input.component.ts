import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() value: string | number | null = '';
  @Input() type = 'text';
  @Input() inputId?: string;
  @Input() step?: number;
  @Input() size: 'sm' | 'md' = 'md';
  @Input() invalid = false;
  @Output() valueChange = new EventEmitter<string>();

  disabled = false;
  private onChange: (value: string | number | null) => void = () => {};
  onTouched: () => void = () => {};

  // --- ControlValueAccessor: Angular Forms -> inpuy ---
  writeValue(value: string | number |null): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;  
  }
  registerOnTouched(fn:() => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --- input -> Angular Forms (y -> padre por valueChange) ---
  onInputChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = this.type === 'number' ? (raw === '' ? null : Number(raw)) : raw;
    this.value = parsed;
    this.onChange(parsed);
    this.valueChange.emit(raw);
  }
}
