import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LotListComponent } from './lot-list';
import { LotService } from '../../../core/services/lot';
import { of } from 'rxjs';

describe('LotListComponent', () => {
  let component: LotListComponent;
  let fixture: ComponentFixture<LotListComponent>;
  let lotService: LotService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LotListComponent,
        NoopAnimationsModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LotListComponent);
    component = fixture.componentInstance;
    lotService = TestBed.inject(LotService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('downloadReport should call getReport and create a download link', () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    const getReportSpy = vi.spyOn(lotService, 'getReport').mockReturnValue(of(mockBlob));
    const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:http://test');
    const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL');

    component.downloadReport(1, 'Test Lot');

    expect(getReportSpy).toHaveBeenCalledWith(1);
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });
});
