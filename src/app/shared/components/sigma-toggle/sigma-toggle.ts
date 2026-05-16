import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sigma-toggle',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sigma-toggle.html',
  styleUrl: './sigma-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sigma-toggle--checked]': 'checked',
    '[class.sigma-toggle--disabled]': 'disabled',
  },
})
export class SigmaToggleComponent {
  @Input() checked = false;
  @Input() label: string | undefined;
  @Input() disabled = false;

  @Output() toggle = new EventEmitter<boolean>();

  onClick(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.toggle.emit(this.checked);
  }
}
