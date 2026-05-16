import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';
import { SigmaBtnComponent } from '../sigma-btn/sigma-btn';

@Component({
  selector: 'sigma-empty-state',
  standalone: true,
  imports: [NgIf, SigmaBtnComponent],
  templateUrl: './sigma-empty-state.html',
  styleUrl: './sigma-empty-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigmaEmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel: string | undefined;

  @Output() action = new EventEmitter<void>();
}
