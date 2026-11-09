import { Component, EventEmitter, Output } from '@angular/core';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSortSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(value);
  }
}
