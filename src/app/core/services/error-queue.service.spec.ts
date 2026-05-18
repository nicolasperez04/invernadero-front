import { ErrorQueueService, QueuedError } from './error-queue.service';

describe('ErrorQueueService', () => {
  let service: ErrorQueueService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
    service = new ErrorQueueService();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('enqueue', () => {
    it('should add error to queue', () => {
      service.enqueue({ type: 'HTTP-500', message: 'Server error' });

      const errors = service.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('HTTP-500');
      expect(errors[0].message).toBe('Server error');
      expect(errors[0].reported).toBe(false);
      expect(errors[0].id).toBeDefined();
    });

    it('should deduplicate identical errors within 60s window', () => {
      service.enqueue({ type: 'HTTP-500', message: 'Server error' });
      service.enqueue({ type: 'HTTP-500', message: 'Server error' });

      expect(service.getErrors()).toHaveLength(1);
    });

    it('should allow same error after 60s window expires', () => {
      service.enqueue({ type: 'HTTP-500', message: 'Server error' });
      vi.advanceTimersByTime(61000);
      service.enqueue({ type: 'HTTP-500', message: 'Server error' });

      expect(service.getErrors()).toHaveLength(2);
    });

    it('should use default type and message when not provided', () => {
      service.enqueue({});

      const errors = service.getErrors();
      expect(errors[0].type).toBe('RUNTIME');
      expect(errors[0].message).toBe('Error desconocido');
    });

    it('should persist to localStorage', () => {
      service.enqueue({ type: 'HTTP-404', message: 'Not found' });

      const stored = JSON.parse(localStorage.getItem('taiga_error_queue')!);
      expect(stored).toHaveLength(1);
      expect(stored[0].type).toBe('HTTP-404');
    });
  });

  describe('getErrors', () => {
    it('should return all errors', () => {
      service.enqueue({ type: 'HTTP-400', message: 'Bad request' });
      service.enqueue({ type: 'HTTP-500', message: 'Server error' });

      expect(service.getErrors()).toHaveLength(2);
    });

    it('should return a copy of the errors array', () => {
      service.enqueue({ type: 'RUNTIME', message: 'test' });
      const errors = service.getErrors();
      errors.push({} as QueuedError);
      expect(service.getErrors()).toHaveLength(1);
    });
  });

  describe('getUnreportedErrors', () => {
    it('should return only unreported errors', () => {
      service.enqueue({ type: 'HTTP-400', message: 'Error 2' });
      service.enqueue({ type: 'HTTP-500', message: 'Error 1' });

      const errors = service.getErrors();
      expect(errors[0].message).toBe('Error 1');
      service.markAsReported([errors[0].id]);

      const unreported = service.getUnreportedErrors();
      expect(unreported).toHaveLength(1);
      expect(unreported[0].message).toBe('Error 2');
    });
  });

  describe('markAsReported', () => {
    it('should mark specific errors as reported', () => {
      service.enqueue({ type: 'RUNTIME', message: 'test' });
      const error = service.getErrors()[0];

      service.markAsReported([error.id]);

      expect(service.getErrors()[0].reported).toBe(true);
    });
  });

  describe('clearAll', () => {
    it('should remove all errors from queue and storage', () => {
      service.enqueue({ type: 'HTTP-500', message: 'test' });
      service.clearAll();

      expect(service.getErrors()).toHaveLength(0);
      expect(localStorage.getItem('taiga_error_queue')).toBe('[]');
    });
  });

  describe('clearSession', () => {
    it('should remove session errors and keep older errors', () => {
      const oldTime = Date.now() - 100000;
      vi.setSystemTime(oldTime);
      service.enqueue({ type: 'HTTP-500', message: 'old error' });
      vi.setSystemTime(oldTime + 50000);
      sessionStorage.setItem('sessionStart', (oldTime + 30000).toString());

      service.clearSession();

      expect(service.getErrors()).toHaveLength(1);
    });
  });
});
