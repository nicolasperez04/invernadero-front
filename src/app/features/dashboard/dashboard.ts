import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil, debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import Chart from 'chart.js/auto';

import { DashboardService } from '../../core/services/dashboard.service';
import { CropService } from '../../core/services/crop';
import { SseService } from '../../core/services/sse.service';
import {
  DashboardResponse,
  EventChartDTO,
  LotStatusDTO,
  LotProgressDTO,
  UpcomingHarvestDTO,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ICONS,
} from '../../core/models/dashboard.model';

import { SigmaCardComponent } from '../../shared/components/sigma-card/sigma-card';
import { SigmaBadgeComponent } from '../../shared/components/sigma-badge/sigma-badge';
import { SigmaEmptyStateComponent } from '../../shared/components/sigma-empty-state/sigma-empty-state';
import { SigmaSpinnerComponent } from '../../shared/components/sigma-spinner/sigma-spinner';
import { SigmaProgressComponent } from '../../shared/components/sigma-progress/sigma-progress';

interface Crop {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    SigmaCardComponent,
    SigmaBadgeComponent,
    SigmaEmptyStateComponent,
    SigmaSpinnerComponent,
    SigmaProgressComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  eventChart: EventChartDTO | null = null;
  lotStatuses: LotStatusDTO[] = [];
  lotProgress: LotProgressDTO[] = [];
  upcomingHarvests: UpcomingHarvestDTO[] = [];
  crops: Crop[] = [];

  selectedCropId: number | null = null;
  loading = false;
  initialLoading = true;
  errorMessage = '';

  @ViewChild('eventChartCanvas') eventChartCanvas!: ElementRef<HTMLCanvasElement>;
  private eventChartInstance: Chart | null = null;
  private destroy$ = new Subject<void>();
  private dashboardSubscription?: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private cropService: CropService,
    private sseService: SseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadCrops();
    this.loadDashboard();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter((event: any) => event.url === '/dashboard'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.loadDashboard();
      });

    this.sseService.events$
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe(() => this.loadDashboard());
    this.sseService.connect();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.sseService.disconnect();
    this.dashboardSubscription?.unsubscribe();
    if (this.eventChartInstance) {
      this.eventChartInstance.destroy();
    }
  }

  ngAfterViewInit(): void {}

  loadCrops(): void {
    this.cropService.getAll().subscribe({
      next: (crops) => {
        this.crops = crops;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando cultivos:', err);
      },
    });
  }

  loadDashboard(): void {
    this.dashboardSubscription?.unsubscribe();
    this.loading = true;
    this.errorMessage = '';

    const request$ = this.selectedCropId
      ? this.dashboardService.getDashboardByCrop(this.selectedCropId)
      : this.dashboardService.getDashboard();

    this.dashboardSubscription = request$.subscribe({
      next: (response: DashboardResponse) => {
        this.eventChart = response.eventChart;
        this.lotStatuses = response.lotStatuses;
        this.lotProgress = response.lotProgress;
        this.upcomingHarvests = response.upcomingHarvests || [];

        this.loading = false;
        this.initialLoading = false;
        this.waitForCanvasWithObserver();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.errorMessage = this.translate.instant('dashboard.loadingError');
        this.loading = false;
        this.initialLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  createEventChart(): void {
    if (!this.eventChart || !this.eventChart.labels || !this.eventChart.values) return;

    let canvasElement: HTMLCanvasElement | null = this.eventChartCanvas?.nativeElement;
    if (!canvasElement) {
      canvasElement = document.querySelector('#eventChartCanvas') as HTMLCanvasElement;
    }
    if (!canvasElement) return;

    if (this.eventChartInstance) {
      this.eventChartInstance.destroy();
    }

    const labels = this.eventChart.labels.map((d: string) => {
      const date = new Date(d + 'T00:00:00');
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    });

    const data = this.eventChart.values;

    this.eventChartInstance = new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: this.translate.instant('dashboard.eventActivity'),
            data,
            backgroundColor: 'rgba(94, 178, 109, 0.8)',
            borderColor: '#5FB26D',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#3E2E22',
            titleColor: 'rgba(255,255,255,0.85)',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const label = context.parsed.y;
                return `${label} ${this.translate.instant('dashboard.totalEvents')}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#8D7E6E',
              font: { size: 11, family: 'Plus Jakarta Sans' },
              maxRotation: 40,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(92, 74, 58, 0.06)' },
            ticks: {
              color: '#8D7E6E',
              font: { size: 11, family: 'Plus Jakarta Sans' },
              stepSize: 1,
            },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }

  private waitForCanvasWithObserver(): void {
    const tryCreateChart = () => {
      const canvasEl = document.getElementById('eventChartCanvas') as HTMLCanvasElement;
      if (canvasEl) {
        this.createEventChart();
        this.cdr.markForCheck();
        return true;
      }
      return false;
    };

    if (tryCreateChart()) return;

    const observer = new MutationObserver(() => {
      if (tryCreateChart()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      tryCreateChart();
      this.cdr.markForCheck();
    }, 5000);
  }

  onCropChange(): void {
    this.loadDashboard();
  }

  getStatusColor(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    const colorMap: Record<string, string> = {
      GREEN: 'var(--olive-600)',
      YELLOW: 'var(--amber-500)',
      RED: 'var(--danger-color)',
    };
    return colorMap[status] || 'var(--neutral-400)';
  }

  getStatusDotColor(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    const colorMap: Record<string, string> = {
      GREEN: '#4E965B',
      YELLOW: '#F5A623',
      RED: '#C94A4A',
    };
    return colorMap[status] || '#9E9E9E';
  }

  getStatusIcon(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    return STATUS_ICONS[status];
  }

  getStatusLabel(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    return STATUS_LABELS[status];
  }

  getBadgeColor(status: 'GREEN' | 'YELLOW' | 'RED'): 'green' | 'amber' | 'red' | 'blue' | 'gray' {
    const map: Record<string, 'green' | 'amber' | 'red' | 'blue' | 'gray'> = {
      GREEN: 'green',
      YELLOW: 'amber',
      RED: 'red',
    };
    return map[status] || 'gray';
  }

  getTimelineBadgeColor(h: UpcomingHarvestDTO): 'green' | 'amber' | 'red' | 'blue' | 'gray' {
    if (h.daysRemaining < 0) return 'red';
    if (h.daysRemaining <= 7) return 'amber';
    return 'green';
  }

  getInactivityLabel(level: 'GREEN' | 'YELLOW' | 'RED'): string {
    const labels: Record<string, string> = {
      GREEN: this.translate.instant('dashboard.inactivityGreen'),
      YELLOW: this.translate.instant('dashboard.inactivityYellow'),
      RED: this.translate.instant('dashboard.inactivityRed'),
    };
    return labels[level];
  }

  getProgressWidth(progress: number): number {
    return Math.min(Math.max(progress, 0), 100);
  }

  formatHarvestDate(dateString: string): string {
    if (!dateString || dateString === 'null') return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  getDaysLabel(lot: LotProgressDTO): string {
    if (lot.sowingDate === 'null' || lot.totalDays === 0) return '-';
    return `${lot.daysElapsed}/${lot.totalDays} ${this.translate.instant('lots.days')}`;
  }

  getRemainingLabel(lot: LotProgressDTO): string {
    if (lot.sowingDate === 'null') return '';
    if (lot.daysRemaining <= 0) return this.translate.instant('lots.harvestReady');
    return `${lot.daysRemaining} ${this.translate.instant('lots.daysRemainingLabel')}`;
  }

  hasSowing(lot: LotProgressDTO): boolean {
    return lot.sowingDate !== 'null';
  }

  getSowingDateLabel(lot: LotProgressDTO): string {
    if (lot.sowingDate === 'null') return '';
    return this.formatHarvestDate(lot.sowingDate);
  }

  // ── KPIs ──

  get kpiTotalCrops(): number {
    return this.crops.length;
  }

  get kpiTotalLots(): number {
    return this.lotStatuses.length;
  }

  get kpiEventsLast30Days(): number {
    if (!this.eventChart?.values) return 0;
    return this.eventChart.values.reduce((sum, v) => sum + v, 0);
  }

  get kpiAvgProgress(): number {
    if (!this.lotProgress.length) return 0;
    const sum = this.lotProgress.reduce((acc, l) => acc + l.progress, 0);
    return Math.round(sum / this.lotProgress.length);
  }

  // ── Alerts ──

  get alertLots(): LotStatusDTO[] {
    return this.lotStatuses.filter((l) => l.status !== 'GREEN' || l.inactivityLevel !== 'GREEN');
  }

  get hasAlerts(): boolean {
    return this.alertLots.length > 0;
  }

  // ── Skeleton helper ──

  get skeletonItems(): number[] {
    return [0, 1, 2, 3];
  }
}
