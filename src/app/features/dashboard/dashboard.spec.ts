import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';

import { DashboardComponent } from './dashboard';
import { SseService } from '../../core/services/sse.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { CropService } from '../../core/services/crop';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let sseEventsSubject: Subject<{ type: string; data: any }>;

  const mockDashboardService = {
    getDashboard: () => of({ eventChart: null, lotStatuses: [], lotProgress: [], upcomingHarvests: [] }),
    getDashboardByCrop: () => of({ eventChart: null, lotStatuses: [], lotProgress: [], upcomingHarvests: [] }),
  };

  const mockCropService = {
    getAll: () => of([]),
  };

  beforeEach(async () => {
    sseEventsSubject = new Subject<{ type: string; data: any }>();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: SseService,
          useValue: {
            events$: sseEventsSubject.asObservable(),
            connect: () => {},
            disconnect: () => {},
          },
        },
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: CropService, useValue: mockCropService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload dashboard on SSE event with debounce', () => {
    vi.useFakeTimers();
    const loadSpy = vi.spyOn(component, 'loadDashboard');

    sseEventsSubject.next({ type: 'LOT_UPDATED', data: { type: 'LOT_UPDATED' } });
    sseEventsSubject.next({ type: 'CROP_UPDATED', data: { type: 'CROP_UPDATED' } });

    expect(loadSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(loadSpy).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
