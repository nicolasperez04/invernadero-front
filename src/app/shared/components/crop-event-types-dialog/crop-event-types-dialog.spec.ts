import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CropEventTypesDialogComponent } from './crop-event-types-dialog';

describe('CropEventTypesDialogComponent', () => {
  let component: CropEventTypesDialogComponent;
  let fixture: ComponentFixture<CropEventTypesDialogComponent>;

  const mockEventTypes = [
    { id: 1, name: 'Siembra', category: 'PRODUCCION' },
    { id: 2, name: 'Cosecha', category: 'PRODUCCION' },
    { id: 3, name: 'Riego', category: 'MANTENIMIENTO' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropEventTypesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CropEventTypesDialogComponent);
    component = fixture.componentInstance;
    component.cropId = 1;
    component.cropName = 'Tomate';
    component.allEventTypes = mockEventTypes;
    component.assignedEventTypeIds = new Set([1, 2]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy assignedIds on init', () => {
    expect(component.selectedIds).toEqual(new Set([1, 2]));
    expect(component.originalIds).toEqual(new Set([1, 2]));
  });

  it('should toggle type selection', () => {
    component.toggleType(1);
    expect(component.selectedIds.has(1)).toBe(false);

    component.toggleType(3);
    expect(component.selectedIds.has(3)).toBe(true);
  });

  it('should detect changes', () => {
    expect(component.hasChanges).toBe(false);

    component.toggleType(3);
    expect(component.hasChanges).toBe(true);

    component.toggleType(1);
    component.toggleType(1);
    expect(component.hasChanges).toBe(true);
  });

  it('should emit null on cancel', () => {
    const emitSpy = vi.spyOn(component.close, 'emit');
    component.onCancel();
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('should emit selectedIds on save', () => {
    const emitSpy = vi.spyOn(component.close, 'emit');
    component.toggleType(3);
    component.onSave();
    expect(emitSpy).toHaveBeenCalledWith(new Set([1, 2, 3]));
  });
});
