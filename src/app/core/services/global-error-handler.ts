import { ErrorHandler, Injector } from '@angular/core';
import { ErrorQueueService, ErrorType } from './error-queue.service';
import { TaigaService } from './taiga.service';

export class GlobalErrorHandler implements ErrorHandler {
  private errorQueue!: ErrorQueueService;
  private taigaService!: TaigaService;

  constructor(private injector: Injector) {}

  private getErrorQueue(): ErrorQueueService {
    if (!this.errorQueue) {
      this.errorQueue = this.injector.get(ErrorQueueService);
    }
    return this.errorQueue;
  }

  private getTaigaService(): TaigaService {
    if (!this.taigaService) {
      this.taigaService = this.injector.get(TaigaService);
    }
    return this.taigaService;
  }

  handleError(error: any): void {
    const originalError = error?.originalError || error;

    const errorInfo: Partial<{
      type: ErrorType;
      message: string;
      stack: string;
      source: string;
      timestamp: string;
    }> = {
      type: 'RUNTIME',
      message: originalError?.message || 'Error de JavaScript',
      timestamp: new Date().toISOString(),
    };

    if (originalError?.stack) {
      errorInfo.stack = originalError.stack;

      const stackMatch = originalError.stack.match(/at\s+(.+?)\s+at\s+(.+?):(\d+):(\d+)/);
      if (stackMatch) {
        errorInfo.source = `${stackMatch[2]}:${stackMatch[3]}`;
      }
    }

    if (originalError?.message?.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
      errorInfo.message =
        'ExpressionChangedAfterItHasBeenCheckedError - Cambios detectados después de la verificación';
    } else if (originalError?.message?.includes('Cannot read')) {
      errorInfo.message = `Cannot read property: ${originalError.message}`;
    } else if (originalError?.message?.includes('Cannot set')) {
      errorInfo.message = `Cannot set property: ${originalError.message}`;
    }

    console.error('Error capturado por GlobalErrorHandler:', errorInfo);
    this.getErrorQueue().enqueue(errorInfo);
    this.getTaigaService().reportError(errorInfo);
  }
}
