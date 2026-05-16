import { Component, Input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'button[sigma-btn]',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sigma-btn.html',
  styleUrl: './sigma-btn.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sigma-btn--primary]': 'variant === "primary"',
    '[class.sigma-btn--secondary]': 'variant === "secondary"',
    '[class.sigma-btn--ghost]': 'variant === "ghost"',
    '[class.sigma-btn--danger]': 'variant === "danger"',
    '[class.sigma-btn--sm]': 'size === "sm"',
    '[class.sigma-btn--lg]': 'size === "lg"',
    '[class.sigma-btn--loading]': 'loading',
    '[class.sigma-btn--icon-left]': '!!icon && iconPosition === "left"',
    '[class.sigma-btn--icon-right]': '!!icon && iconPosition === "right"',
    '[disabled]': 'disabled || loading',
    '[attr.type]': 'type',
  },
})
export class SigmaBtnComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon: string | undefined;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() type: 'button' | 'submit' = 'button';
}
