import { SseService } from './sse.service';

describe('SseService', () => {
  let service: SseService;
  let mockEventSource: any;
  let addEventListenerSpy: any;
  let closeSpy: any;

  beforeEach(() => {
    closeSpy = vi.fn();
    addEventListenerSpy = vi.fn();

    mockEventSource = {
      addEventListener: addEventListenerSpy,
      close: closeSpy,
    };

    (globalThis as any).EventSource = vi.fn().mockImplementation(function () {
      return mockEventSource;
    });

    localStorage.clear();
    service = new SseService();
  });

  afterEach(() => {
    service.disconnect();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not connect without token', () => {
    service.connect();
    expect((globalThis as any).EventSource).not.toHaveBeenCalled();
  });

  it('should connect with token in localStorage', () => {
    localStorage.setItem('token', 'test-jwt');
    service.connect();
    expect((globalThis as any).EventSource).toHaveBeenCalledWith(
      'http://localhost:8080/api/sse/subscribe?token=test-jwt',
    );
  });

  it('should not create duplicate connections', () => {
    localStorage.setItem('token', 'test-jwt');
    service.connect();
    service.connect();
    expect((globalThis as any).EventSource).toHaveBeenCalledTimes(1);
  });

  it('should listen for dashboard events', () => {
    localStorage.setItem('token', 'test-jwt');
    service.connect();
    expect(addEventListenerSpy).toHaveBeenCalledWith('dashboard', expect.any(Function));
  });

  it('should emit parsed event data to events$', () => {
    localStorage.setItem('token', 'test-jwt');
    service.connect();

    const handler = addEventListenerSpy.mock.calls[0][1];
    const spy = vi.fn();
    service.events$.subscribe(spy);

    handler({ data: '{"type":"LOT_UPDATED"}' });

    expect(spy).toHaveBeenCalledWith({ type: 'LOT_UPDATED', data: { type: 'LOT_UPDATED' } });
  });

  it('should not emit on parse errors', () => {
    localStorage.setItem('token', 'test-jwt');
    service.connect();

    const handler = addEventListenerSpy.mock.calls[0][1];
    const spy = vi.fn();
    service.events$.subscribe(spy);

    handler({ data: 'not-json' });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should disconnect and close EventSource', () => {
    localStorage.setItem('token', 'test-jwt');
    service.connect();
    service.disconnect();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should reconnect on error after 3 seconds', () => {
    vi.useFakeTimers();
    localStorage.setItem('token', 'test-jwt');
    service.connect();

    const onerror = mockEventSource.onerror;

    onerror();
    expect(closeSpy).toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    expect((globalThis as any).EventSource).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('should complete eventsSubject on destroy', () => {
    const spy = vi.fn();
    service.events$.subscribe({ complete: spy });
    service.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
