import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../environments/environment';
import {
  DashboardResponse,
  EventChartDTO,
  LotStatusDTO,
  LotProgressDTO,
} from '../models/dashboard.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDashboard', () => {
    it('should call GET /api/dashboard', () => {
      const mockResponse: DashboardResponse = {
        eventChart: { labels: ['2024-01-01'], values: [5] },
        lotStatuses: [],
        lotProgress: [],
        upcomingHarvests: [],
      };

      service.getDashboard().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/dashboard`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getDashboardByCrop', () => {
    it('should call GET with cropId param', () => {
      const mockResponse: DashboardResponse = {
        eventChart: { labels: [], values: [] },
        lotStatuses: [],
        lotProgress: [],
        upcomingHarvests: [],
      };

      service.getDashboardByCrop(7).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (r) => r.url === `${environment.apiUrl}/dashboard` && r.params.has('cropId'),
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('cropId')).toBe('7');
      req.flush(mockResponse);
    });
  });

  describe('getEventChart', () => {
    it('should call GET /api/dashboard/events without cropId', () => {
      const mockChart: EventChartDTO = { labels: ['A', 'B'], values: [1, 2] };

      service.getEventChart().subscribe((data) => {
        expect(data).toEqual(mockChart);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/events`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChart);
    });

    it('should call GET with cropId query param', () => {
      const mockChart: EventChartDTO = { labels: ['C'], values: [3] };

      service.getEventChart(5).subscribe((data) => {
        expect(data).toEqual(mockChart);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/events?cropId=5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChart);
    });
  });

  describe('getLotStatuses', () => {
    it('should call GET /api/dashboard/status without cropId', () => {
      const mockStatuses: LotStatusDTO[] = [
        { lotId: 1, lotName: 'Lote A', status: 'IN_PRODUCTION', inactivityLevel: 'GREEN' },
      ];

      service.getLotStatuses().subscribe((data) => {
        expect(data).toEqual(mockStatuses);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStatuses);
    });

    it('should call GET with cropId query param', () => {
      const mockStatuses: LotStatusDTO[] = [];

      service.getLotStatuses(3).subscribe((data) => {
        expect(data).toEqual(mockStatuses);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/status?cropId=3`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStatuses);
    });
  });

  describe('getLotProgress', () => {
    it('should call GET /api/dashboard/progress', () => {
      const mockProgress: LotProgressDTO[] = [
        {
          lotId: 1,
          lotName: 'Lote A',
          progress: 50,
          estimatedHarvestDate: '2024-06-01T00:00:00Z',
          sowingDate: '2024-01-01T00:00:00Z',
          totalDays: 150,
          daysElapsed: 75,
          daysRemaining: 75,
        },
      ];

      service.getLotProgress().subscribe((data) => {
        expect(data).toEqual(mockProgress);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/progress`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProgress);
    });
  });
});
