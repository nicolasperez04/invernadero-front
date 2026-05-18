import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TaigaService } from './taiga.service';
import { ErrorQueueService } from './error-queue.service';
import { TAIGA_CONFIG } from './taiga-config';

describe('TaigaService', () => {
  let service: TaigaService;
  let httpMock: HttpTestingController;
  let errorQueueMock: { enqueue: any; getUnreportedErrors: any; markAsReported: any };

  beforeEach(() => {
    errorQueueMock = {
      enqueue: vi.fn(),
      getUnreportedErrors: vi.fn().mockReturnValue([]),
      markAsReported: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TaigaService,
        { provide: ErrorQueueService, useValue: errorQueueMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TaigaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('reportError', () => {
    it('should send POST to Taiga API with formatted body', async () => {
      const reportPromise = service.reportError({
        type: 'HTTP-500',
        message: 'Internal server error',
        url: '/api/dashboard',
        method: 'GET',
        status: 500,
      });

      const req = httpMock.expectOne(`${TAIGA_CONFIG.apiUrl}/issues`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${TAIGA_CONFIG.authToken}`);
      expect(req.request.body).toMatchObject({
        project: TAIGA_CONFIG.projectId,
        subject: expect.stringContaining('[500]'),
        priority: TAIGA_CONFIG.priorityHigh,
        status: TAIGA_CONFIG.issueStatusNew,
        type: TAIGA_CONFIG.issueTypeBug,
        tags: expect.arrayContaining(['automatic', 'error-reporting', 'http-500']),
      });

      req.flush({ id: 1 });
      await reportPromise;
    });

    it('should handle HTTP 404 error type correctly', async () => {
      const reportPromise = service.reportError({
        type: 'HTTP-404',
        message: 'Resource not found',
        status: 404,
      });

      const req = httpMock.expectOne(`${TAIGA_CONFIG.apiUrl}/issues`);
      expect(req.request.body).toMatchObject({
        priority: TAIGA_CONFIG.priorityNormal,
        assigned_to: TAIGA_CONFIG.bobId,
      });

      req.flush({ id: 2 });
      await reportPromise;
    });

    it('should enqueue error when Taiga API call fails', async () => {
      const reportPromise = service.reportError({
        type: 'HTTP-500',
        message: 'Server error',
      });

      const req = httpMock.expectOne(`${TAIGA_CONFIG.apiUrl}/issues`);
      req.error(new ProgressEvent('Network error'));
      await reportPromise;

      expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'HTTP-500',
          message: 'Server error',
        }),
      );
    });

    it('should not send duplicate reports while already reporting', async () => {
      const p1 = service.reportError({ type: 'HTTP-500', message: 'First' });
      const p2 = service.reportError({ type: 'HTTP-500', message: 'Second' });

      const req = httpMock.expectOne(`${TAIGA_CONFIG.apiUrl}/issues`);
      req.flush({ id: 1 });
      await p1;
      await p2;

      httpMock.verify();
    });
  });
});
