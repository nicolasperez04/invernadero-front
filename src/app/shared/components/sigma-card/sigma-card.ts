import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sigma-card',
  standalone: true,
  templateUrl: './sigma-card.html',
  styleUrl: './sigma-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sigma-card--kpi]': 'variant === "kpi"',
    '[class.sigma-card--form]': 'variant === "form"',
    '[class.sigma-card--elevated]': 'variant === "elevated"',
    '[class.sigma-card--hover]': 'hover',
  },
})
export class SigmaCardComponent {
  @Input() variant: 'default' | 'kpi' | 'form' | 'elevated' = 'default';
  @Input() hover = false;
}
