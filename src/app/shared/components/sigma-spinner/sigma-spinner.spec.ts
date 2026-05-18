import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SigmaSpinnerComponent } from './sigma-spinner';

describe('SigmaSpinnerComponent', () => {
  let component: SigmaSpinnerComponent;
  let fixture: ComponentFixture<SigmaSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaSpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply sm size class', () => {
    component.size = 'sm';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-spinner--sm')).toBe(true);
  });

  it('should apply lg size class', () => {
    component.size = 'lg';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-spinner--lg')).toBe(true);
  });

  it('should render label when provided', () => {
    component.label = 'Loading...';
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('.sigma-spinner__label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain('Loading...');
  });

  it('should not render label when not provided', () => {
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.sigma-spinner__label'));
    expect(labelEl).toBeNull();
  });
});
