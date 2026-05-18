import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SigmaProgressComponent } from './sigma-progress';

describe('SigmaProgressComponent', () => {
  let component: SigmaProgressComponent;
  let fixture: ComponentFixture<SigmaProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaProgressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should compute percent correctly', () => {
    component.value = 50;
    component.max = 100;
    expect(component.percent).toBe(50);

    component.value = 150;
    expect(component.percent).toBe(100);

    component.value = 0;
    expect(component.percent).toBe(0);
  });

  it('should return 0 percent when max is 0 or negative', () => {
    component.value = 50;
    component.max = 0;
    expect(component.percent).toBe(0);

    component.max = -10;
    expect(component.percent).toBe(0);
  });

  it('should apply amber color class', () => {
    component.color = 'amber';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-progress--amber')).toBe(true);
  });

  it('should apply red color class', () => {
    component.color = 'red';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-progress--red')).toBe(true);
  });

  it('should apply sm size class', () => {
    component.size = 'sm';
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-progress--sm')).toBe(true);
  });

  it('should show percent text', () => {
    component.value = 75;
    fixture.detectChanges();

    const percentEl = fixture.debugElement.query(By.css('.sigma-progress__percent'));
    expect(percentEl).toBeTruthy();
    expect(percentEl.nativeElement.textContent).toContain('75%');
  });

  it('should hide percent text when showPercent is false', () => {
    component.showPercent = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.sigma-progress__percent'))).toBeNull();
  });

  it('should render label', () => {
    component.label = 'Progress';
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('.sigma-progress__label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain('Progress');
  });
});
