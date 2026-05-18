import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { SigmaBtnComponent } from './sigma-btn';

describe('SigmaBtnComponent', () => {
  let component: SigmaBtnComponent;
  let fixture: ComponentFixture<SigmaBtnComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaBtnComponent);
    component = fixture.componentInstance;
    cdr = fixture.componentRef.changeDetectorRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply primary variant class by default', () => {
    expect(fixture.nativeElement.classList.contains('sigma-btn--primary')).toBe(true);
  });

  it('should apply secondary variant class', () => {
    component.variant = 'secondary';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--secondary')).toBe(true);
  });

  it('should apply ghost variant class', () => {
    component.variant = 'ghost';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--ghost')).toBe(true);
  });

  it('should apply danger variant class', () => {
    component.variant = 'danger';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--danger')).toBe(true);
  });

  it('should apply danger-ghost variant class', () => {
    component.variant = 'danger-ghost';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--danger-ghost')).toBe(true);
  });

  it('should apply info-ghost variant class', () => {
    component.variant = 'info-ghost';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--info-ghost')).toBe(true);
  });

  it('should apply warning-ghost variant class', () => {
    component.variant = 'warning-ghost';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--warning-ghost')).toBe(true);
  });

  it('should disable button when loading is true and add loading class', () => {
    component.loading = true;
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--loading')).toBe(true);
    expect((fixture.nativeElement as HTMLButtonElement).disabled).toBe(true);
  });

  it('should disable button when disabled is true', () => {
    component.disabled = true;
    cdr.markForCheck();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLButtonElement).disabled).toBe(true);
  });

  it('should apply icon-left class when icon is set', () => {
    component.icon = 'edit';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--icon-left')).toBe(true);
    expect(fixture.nativeElement.classList.contains('sigma-btn--icon-right')).toBe(false);
  });

  it('should apply icon-right class when iconPosition is right', () => {
    component.icon = 'edit';
    component.iconPosition = 'right';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-btn--icon-right')).toBe(true);
    expect(fixture.nativeElement.classList.contains('sigma-btn--icon-left')).toBe(false);
  });

  it('should set type attribute', () => {
    expect(fixture.nativeElement.getAttribute('type')).toBe('button');

    component.type = 'submit';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('type')).toBe('submit');
  });
});
