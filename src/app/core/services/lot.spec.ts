import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LotService } from './lot';
import { environment } from '../../../environments/environment';

describe('LotService', () => {
  let service: LotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getReport should fetch PDF blob', () => {
    const mockBlob = new Blob(['%PDF-1.4 test'], { type: 'application/pdf' });

    service.getReport(1).subscribe((blob) => {
      expect(blob.size).toBe(mockBlob.size);
      expect(blob.type).toBe('application/pdf');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/lots/1/report`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);
  });
});
