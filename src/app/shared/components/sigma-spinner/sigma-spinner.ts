import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sigma-spinner',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sigma-spinner.html',
  styleUrl: './sigma-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sigma-spinner--sm]': 'size === "sm"',
    '[class.sigma-spinner--lg]': 'size === "lg"',
  },
})
export class SigmaSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string | undefined;
}
