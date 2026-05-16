import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sigma-progress',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sigma-progress.html',
  styleUrl: './sigma-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sigma-progress--sm]': 'size === "sm"',
    '[class.sigma-progress--green]': 'color === "green"',
    '[class.sigma-progress--amber]': 'color === "amber"',
    '[class.sigma-progress--red]': 'color === "red"',
  },
})
export class SigmaProgressComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() color: 'green' | 'amber' | 'red' = 'green';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() label: string | undefined;
  @Input() showPercent = true;

  get percent(): number {
    if (this.max <= 0) return 0;
    return Math.min(Math.round((this.value / this.max) * 100), 100);
  }
}
