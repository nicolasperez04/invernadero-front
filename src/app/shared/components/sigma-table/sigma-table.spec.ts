import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { SigmaTableComponent, SigmaColumn } from './sigma-table';

describe('SigmaTableComponent', () => {
  let component: SigmaTableComponent;
  let fixture: ComponentFixture<SigmaTableComponent>;

  const mockColumns: SigmaColumn[] = [
    { key: 'name', labelKey: 'Name' },
    { key: 'age', labelKey: 'Age' },
  ];

  const mockData = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigmaTableComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SigmaTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rows when columns and data are provided', () => {
    component.columns = mockColumns;
    component.data = mockData;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('Alice');
    expect(rows[1].nativeElement.textContent).toContain('Bob');
  });

  it('should show skeleton when loading is true', () => {
    component.columns = mockColumns;
    component.loading = true;
    component.skeletonRows = 3;
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('.sigma-table__skeleton'));
    expect(skeleton).toBeTruthy();

    const skeletonRows = fixture.debugElement.queryAll(By.css('.sigma-table__skeleton-row'));
    expect(skeletonRows.length).toBe(3);
  });

  it('should show empty state when no data and not loading', () => {
    component.columns = mockColumns;
    component.data = [];
    component.emptyMessage = 'No records found';
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.css('sigma-empty-state'));
    expect(emptyState).toBeTruthy();
    expect(component.emptyMessage).toBe('No records found');
  });

  it('should return value from getRowValue or em dash', () => {
    const row = { name: 'Alice' };
    expect(component.getRowValue(row, 'name')).toBe('Alice');
    expect(component.getRowValue(row, 'age')).toBe('—');
  });

  it('should apply custom row class function', () => {
    component.columns = mockColumns;
    component.data = mockData;
    component.rowClass = (row: any) => (row.name === 'Alice' ? 'highlight' : '');
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows[0].nativeElement.classList.contains('highlight')).toBe(true);
    expect(rows[1].nativeElement.classList.contains('highlight')).toBe(false);
  });
});
