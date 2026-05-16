import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sigma-badge',
  standalone: true,
  templateUrl: './sigma-badge.html',
  styleUrl: './sigma-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sigma-badge--green]': 'color === "green"',
    '[class.sigma-badge--amber]': 'color === "amber"',
    '[class.sigma-badge--red]': 'color === "red"',
    '[class.sigma-badge--blue]': 'color === "blue"',
    '[class.sigma-badge--gray]': 'color === "gray"',
    '[class.sigma-badge--sm]': 'size === "sm"',
    '[class.sigma-badge--lg]': 'size === "lg"',
  },
})
export class SigmaBadgeComponent {
  @Input() color: 'green' | 'amber' | 'red' | 'blue' | 'gray' = 'green';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
