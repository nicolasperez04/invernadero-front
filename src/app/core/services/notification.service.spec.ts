import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';
import { NotificationDTO } from '../models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call GET /api/notifications', () => {
      const mockNotifications: NotificationDTO[] = [
        {
          id: 1,
          lotId: 1,
          lotName: 'Lote A',
          type: 'HARVEST_7_DAYS',
          level: 'INFO',
          message: 'Cosecha en 7 días',
          createdAt: '2024-01-01T00:00:00Z',
          read: false,
        },
      ];

      service.getAll().subscribe((data) => {
        expect(data).toEqual(mockNotifications);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/notifications`);
      expect(req.request.method).toBe('GET');
      req.flush(mockNotifications);
    });
  });

  describe('getUnreadCount', () => {
    it('should call GET /api/notifications/unread-count', () => {
      service.getUnreadCount().subscribe((data) => {
        expect(data).toEqual({ count: 3 });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/notifications/unread-count`);
      expect(req.request.method).toBe('GET');
      req.flush({ count: 3 });
    });
  });

  describe('markAsRead', () => {
    it('should call PUT /api/notifications/{id}/read', () => {
      const notificationId = 5;

      service.markAsRead(notificationId).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/notifications/5/read`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  describe('markAllAsRead', () => {
    it('should call PUT /api/notifications/read-all', () => {
      service.markAllAsRead().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/notifications/read-all`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });
});
