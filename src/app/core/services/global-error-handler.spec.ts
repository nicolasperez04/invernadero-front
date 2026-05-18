import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';
import { ErrorQueueService } from './error-queue.service';
import { TaigaService } from './taiga.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let injector: Injector;
  let errorQueueMock: { enqueue: any };
  let taigaServiceMock: { reportError: any };

  beforeEach(() => {
    errorQueueMock = { enqueue: vi.fn() };
    taigaServiceMock = { reportError: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorQueueService, useValue: errorQueueMock },
        { provide: TaigaService, useValue: taigaServiceMock },
      ],
    });

    injector = TestBed.inject(Injector);
    handler = new GlobalErrorHandler(injector);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  describe('handleError', () => {
    it('should enqueue error in ErrorQueueService', () => {
      const error = new Error('Something went wrong');
      handler.handleError(error);

      expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RUNTIME',
          message: 'Something went wrong',
        }),
      );
    });

    it('should report error to TaigaService', () => {
      const error = new Error('Something went wrong');
      handler.handleError(error);

      expect(taigaServiceMock.reportError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RUNTIME',
          message: 'Something went wrong',
        }),
      );
    });

    it('should extract stack info from error', () => {
      const error = {
        originalError: {
          message: 'TypeError: null is not an object',
          stack:
            'TypeError: null is not an object\n    at Object.<anonymous> (http://localhost/main.js:42:10)\n    at handleError (http://localhost/main.js:15:5)',
        },
      };
      handler.handleError(error);

      expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.stringContaining('http://localhost/main.js'),
          source: expect.any(String),
        }),
      );
    });

    it('should handle ExpressionChangedAfterItHasBeenCheckedError', () => {
      const error = new Error('ExpressionChangedAfterItHasBeenCheckedError: some error');
      handler.handleError(error);

      expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            'ExpressionChangedAfterItHasBeenCheckedError - Cambios detectados después de la verificación',
        }),
      );
    });

    it('should handle error without stack gracefully', () => {
      const error = { message: 'Something broke' };
      handler.handleError(error);

      expect(errorQueueMock.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RUNTIME',
          message: 'Something broke',
        }),
      );
    });
  });
});
