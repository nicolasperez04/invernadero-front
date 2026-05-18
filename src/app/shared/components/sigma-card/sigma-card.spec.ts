import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { SigmaCardComponent } from './sigma-card';

describe('SigmaCardComponent', () => {
  let component: SigmaCardComponent;
  let fixture: ComponentFixture<SigmaCardComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaCardComponent);
    component = fixture.componentInstance;
    cdr = fixture.componentRef.changeDetectorRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default variant to default and hover to false', () => {
    expect(component.variant).toBe('default');
    expect(component.hover).toBe(false);
  });

  it('should apply kpi variant class', () => {
    component.variant = 'kpi';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-card--kpi')).toBe(true);
  });

  it('should apply form variant class', () => {
    component.variant = 'form';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-card--form')).toBe(true);
  });

  it('should apply elevated variant class', () => {
    component.variant = 'elevated';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-card--elevated')).toBe(true);
  });

  it('should apply hover class when hover is true', () => {
    component.hover = true;
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-card--hover')).toBe(true);
  });

  it('should remove hover class when hover becomes false', () => {
    component.hover = true;
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-card--hover')).toBe(true);

    component.hover = false;
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-card--hover')).toBe(false);
  });
});
