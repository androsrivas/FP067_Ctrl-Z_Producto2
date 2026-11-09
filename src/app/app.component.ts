import { Component } from '@angular/core';
import { TeamComponent } from './pages/team/team.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TeamComponent],
  template: `<app-team></app-team>`
})
export class AppComponent {}