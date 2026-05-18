import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { SigmaBadgeComponent } from './sigma-badge';

describe('SigmaBadgeComponent', () => {
  let component: SigmaBadgeComponent;
  let fixture: ComponentFixture<SigmaBadgeComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaBadgeComponent);
    component = fixture.componentInstance;
    cdr = fixture.componentRef.changeDetectorRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default color to green and size to md', () => {
    expect(component.color).toBe('green');
    expect(component.size).toBe('md');
    expect(fixture.nativeElement.classList.contains('sigma-badge--green')).toBe(true);
  });

  it('should apply red color class', () => {
    component.color = 'red';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-badge--red')).toBe(true);
    expect(fixture.nativeElement.classList.contains('sigma-badge--green')).toBe(false);
  });

  it('should apply amber color class', () => {
    component.color = 'amber';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-badge--amber')).toBe(true);
  });

  it('should apply blue color class', () => {
    component.color = 'blue';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-badge--blue')).toBe(true);
  });

  it('should apply gray color class', () => {
    component.color = 'gray';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-badge--gray')).toBe(true);
  });

  it('should apply sm size class', () => {
    component.size = 'sm';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-badge--sm')).toBe(true);
  });

  it('should apply lg size class', () => {
    component.size = 'lg';
    cdr.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-badge--lg')).toBe(true);
  });
});
