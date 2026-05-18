import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'sigma-input',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './sigma-input.html',
  styleUrl: './sigma-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SigmaInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.sigma-input--error]': '!!error',
    '[class.sigma-input--disabled]': 'disabled',
    '[class.sigma-input--textarea]': 'type === "textarea"',
  },
})
export class SigmaInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() error: string | undefined;
  @Input() hint: string | undefined;
  @Input() type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'datetime-local'
    | 'date'
    | 'time' = 'text';
  @Input() placeholder = '';
  @Input() iconLeft: string | undefined;
  @Input() disabled = false;
  @Input() required = false;
  @Input() rows = 3;

  @Output() valueChange = new EventEmitter<string>();

  value = '';
  touched = false;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(val: string): void {
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }
}
