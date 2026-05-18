import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SigmaEmptyStateComponent } from './sigma-empty-state';

describe('SigmaEmptyStateComponent', () => {
  let component: SigmaEmptyStateComponent;
  let fixture: ComponentFixture<SigmaEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaEmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.icon).toBe('inbox');
    expect(component.title).toBe('');
    expect(component.description).toBe('');
    expect(component.actionLabel).toBeUndefined();
  });

  it('should render title and description', () => {
    component.title = 'No items found';
    component.description = 'Try adjusting your filters';
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('.sigma-empty-state__title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent).toContain('No items found');

    const descEl = fixture.debugElement.query(By.css('.sigma-empty-state__desc'));
    expect(descEl).toBeTruthy();
    expect(descEl.nativeElement.textContent).toContain('Try adjusting your filters');
  });

  it('should show action button and emit event when clicked', () => {
    component.actionLabel = 'Retry';
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.action, 'emit');
    const btnEl = fixture.debugElement.query(By.css('.sigma-empty-state__action'));

    expect(btnEl).toBeTruthy();
    expect(btnEl.nativeElement.textContent).toContain('Retry');

    btnEl.nativeElement.click();
    expect(emitSpy).toHaveBeenCalled();
  });
});
