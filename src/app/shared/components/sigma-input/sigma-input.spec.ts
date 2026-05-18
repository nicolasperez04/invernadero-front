import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { SigmaInputComponent } from './sigma-input';

describe('SigmaInputComponent', () => {
  let component: SigmaInputComponent;
  let fixture: ComponentFixture<SigmaInputComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaInputComponent);
    component = fixture.componentInstance;
    cdr = fixture.componentRef.changeDetectorRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value via writeValue', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should register onChange and onTouched callbacks', () => {
    const onChange = vi.fn();
    const onTouched = vi.fn();
    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    expect(component['onChange']).toBe(onChange);
    expect(component['onTouched']).toBe(onTouched);
  });

  it('should emit on input and call onChange', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    const valueChangeSpy = vi.spyOn(component.valueChange, 'emit');

    component.onInput('hello');
    expect(component.value).toBe('hello');
    expect(onChange).toHaveBeenCalledWith('hello');
    expect(valueChangeSpy).toHaveBeenCalledWith('hello');
  });

  it('should set touched on blur and call onTouched', () => {
    const onTouched = vi.fn();
    component.registerOnTouched(onTouched);

    component.onBlur();
    expect(component.touched).toBe(true);
    expect(onTouched).toHaveBeenCalled();
  });

  it('should apply error class', () => {
    component.error = 'Required';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-input--error')).toBe(true);
  });

  it('should apply disabled class', () => {
    component.disabled = true;
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-input--disabled')).toBe(true);
  });

  it('should apply textarea class when type is textarea', () => {
    component.type = 'textarea';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-input--textarea')).toBe(true);
  });
});
