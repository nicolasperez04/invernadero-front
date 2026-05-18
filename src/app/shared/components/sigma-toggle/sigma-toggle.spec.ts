import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SigmaToggleComponent } from './sigma-toggle';

describe('SigmaToggleComponent', () => {
  let component: SigmaToggleComponent;
  let fixture: ComponentFixture<SigmaToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaToggleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle checked on click and emit boolean', () => {
    const emitSpy = vi.spyOn(component.toggle, 'emit');

    component.onClick();
    expect(component.checked).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(true);

    component.onClick();
    expect(component.checked).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should not toggle when disabled', () => {
    component.disabled = true;
    const emitSpy = vi.spyOn(component.toggle, 'emit');

    component.onClick();
    expect(component.checked).toBe(false);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should apply checked host class', () => {
    component.checked = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-toggle--checked')).toBe(true);
  });

  it('should apply disabled host class', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('sigma-toggle--disabled')).toBe(true);
  });

  it('should render label when provided', () => {
    component.label = 'Enable notifications';
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('.sigma-toggle__label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain('Enable notifications');
  });
});
