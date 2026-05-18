import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, lastValueFrom } from 'rxjs';
import { errorInterceptor } from './error-interceptor';
import { ErrorQueueService } from '../services/error-queue.service';
import { TaigaService } from '../services/taiga.service';

describe('errorInterceptor', () => {
  let snackBarMock: { open: any };
  let errorQueueMock: { enqueue: any };
  let taigaServiceMock: { reportError: any };

  const setup = () => {
    snackBarMock = { open: vi.fn() };
    errorQueueMock = { enqueue: vi.fn() };
    taigaServiceMock = { reportError: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ErrorQueueService, useValue: errorQueueMock },
        { provide: TaigaService, useValue: taigaServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  };

  const intercept = (status: number, statusText: string, errorBody?: any) => {
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      status,
      statusText,
      url: '/api/test',
      error: errorBody,
    });

    const next: HttpHandlerFn = () => throwError(() => errorResponse);

    return TestBed.runInInjectionContext(() => errorInterceptor(req, next));
  };

  it('should be created', () => {
    setup();
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

    const result = TestBed.runInInjectionContext(() => errorInterceptor(req, next));
    expect(result).toBeTruthy();
  });

  it('should show snackbar on HTTP error', async () => {
    setup();
    const obs = intercept(500, 'Server Error');

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(snackBarMock.open).toHaveBeenCalledWith('Server Error', 'OK', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  });

  it('should propagate the original error', async () => {
    setup();
    const obs = intercept(403, 'Forbidden');

    await expect(lastValueFrom(obs)).rejects.toThrowError();
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-403', status: 403 }),
    );
  });

  it('should handle 400 status code', async () => {
    setup();
    const obs = intercept(400, 'Bad Request', { message: 'Invalid input' });

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(snackBarMock.open).toHaveBeenCalledWith('Invalid input', 'OK', expect.any(Object));
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-400', status: 400 }),
    );
  });

  it('should handle 401 status code without reporting to Taiga', async () => {
    setup();
    const obs = intercept(401, 'Unauthorized');

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(snackBarMock.open).toHaveBeenCalledWith('Unauthorized', 'OK', expect.any(Object));
    expect(errorQueueMock.enqueue).not.toHaveBeenCalled();
    expect(taigaServiceMock.reportError).not.toHaveBeenCalled();
  });

  it('should handle 403 status code', async () => {
    setup();
    const obs = intercept(403, 'Forbidden');

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-403', status: 403 }),
    );
  });

  it('should handle 404 status code', async () => {
    setup();
    const obs = intercept(404, 'Not Found');

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-404', status: 404 }),
    );
  });

  it('should handle 409 status code', async () => {
    setup();
    const obs = intercept(409, 'Conflict', { message: 'Duplicate entry' });

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(snackBarMock.open).toHaveBeenCalledWith('Duplicate entry', 'OK', expect.any(Object));
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-409', status: 409 }),
    );
  });

  it('should handle 500 status code', async () => {
    setup();
    const obs = intercept(500, 'Server Error');

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-500', status: 500 }),
    );
  });

  it('should handle 0 status code (network error)', async () => {
    setup();
    const obs = intercept(0, 'Network Error');

    await expect(lastValueFrom(obs)).rejects.toThrow();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Network Error - Backend not available',
      'OK',
      expect.any(Object),
    );
    expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HTTP-0', status: 0 }),
    );
  });
});
