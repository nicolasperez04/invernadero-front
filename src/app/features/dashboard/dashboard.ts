import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Chart from 'chart.js/auto';

import { DashboardService } from '../../core/services/dashboard.service';
import { CropService } from '../../core/services/crop';
import {
  DashboardResponse,
  EventChartDTO,
  LotStatusDTO,
  LotProgressDTO,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ICONS
} from '../../core/models/dashboard.model';

interface Crop {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  // Data
  eventChart: EventChartDTO | null = null;
  lotStatuses: LotStatusDTO[] = [];
  lotProgress: LotProgressDTO[] = [];
  crops: Crop[] = [];

  // UI State
  selectedCropId: number | null = null;
  loading = false;
  errorMessage = '';

  // Chart.js
  @ViewChild('eventChartCanvas') eventChartCanvas!: ElementRef<HTMLCanvasElement>;
  private eventChartInstance: Chart | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private cropService: CropService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadCrops();
    this.loadDashboard();

    // Recargar al navegar a esta ruta
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter((event: any) => event.url === '/dashboard'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadDashboard();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.eventChartInstance) {
      this.eventChartInstance.destroy();
    }
  }

  ngAfterViewInit(): void {
  }

  /**
   * Carga la lista de cultivos disponibles
   */
  loadCrops(): void {
    this.cropService.getAll().subscribe({
      next: (crops) => {
        this.crops = crops;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando cultivos:', err);
      }
    });
  }

  /**
   * Carga datos del dashboard (con o sin filtro de cultivo)
   */
  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    const request$ = this.selectedCropId
      ? this.dashboardService.getDashboardByCrop(this.selectedCropId)
      : this.dashboardService.getDashboard();

    request$.subscribe({
      next: (response: DashboardResponse) => {
        this.eventChart = response.eventChart;
        this.lotStatuses = response.lotStatuses;
        this.lotProgress = response.lotProgress;

        this.loading = false;
        
        setTimeout(() => {
          console.log('DEBUG - eventChart:', this.eventChart);
          console.log('DEBUG - canvas:', this.eventChartCanvas?.nativeElement);
          this.createEventChart();
          this.cdr.markForCheck();
        }, 200);
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.errorMessage = this.translate.instant('dashboard.loadingError');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  createEventChart(): void {
    console.log('DEBUG createEventChart - START');
    console.log('DEBUG - canvas:', this.eventChartCanvas?.nativeElement);
    console.log('DEBUG - eventChart:', this.eventChart);
    
    if (!this.eventChartCanvas || !this.eventChart) {
      console.log('DEBUG createEventChart - NO CANVAS OR DATA');
      return;
    }
    
    if (!this.eventChart.labels || !this.eventChart.values) {
      console.log('DEBUG createEventChart - NO LABELS OR VALUES');
      return;
    }

    console.log('DEBUG - labels:', this.eventChart.labels);
    console.log('DEBUG - values:', this.eventChart.values);

    if (this.eventChartInstance) {
      this.eventChartInstance.destroy();
    }

    const labels = this.eventChart.labels.map((d: string) => {
      const date = new Date(d + 'T00:00:00');
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    });

    const data = this.eventChart.values;
    
    console.log('DEBUG - processed labels:', labels);
    console.log('DEBUG - processed data:', data);

    this.eventChartInstance = new Chart(this.eventChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.translate.instant('dashboard.eventActivity'),
          data: data,
          backgroundColor: 'rgba(45, 125, 77, 0.85)',
          borderColor: '#2d7d4d',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const label = context.parsed.y;
                return `${label} ${this.translate.instant('dashboard.totalEvents')}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#666',
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#666',
              font: {
                size: 11
              },
              stepSize: 1
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  /**
   * Maneja cambio de filtro de cultivo
   */
  onCropChange(): void {
    this.loadDashboard();
  }

  /**
   * Retorna el color CSS para un estado de semáforo
   */
  getStatusColor(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    const colorMap = {
      GREEN: '#4caf50',
      YELLOW: '#ff9800',
      RED: '#f44336'
    };
    return colorMap[status];
  }

  /**
   * Retorna el icono para un estado
   */
  getStatusIcon(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    return STATUS_ICONS[status];
  }

  /**
   * Retorna la etiqueta traducida para un estado
   */
  getStatusLabel(status: 'GREEN' | 'YELLOW' | 'RED'): string {
    return STATUS_LABELS[status];
  }

  /**
   * Retorna la etiqueta traducida para nivel de inactividad
   */
  getInactivityLabel(level: 'GREEN' | 'YELLOW' | 'RED'): string {
    const inactivityLabels = {
      GREEN: this.translate.instant('dashboard.inactivityGreen'),
      YELLOW: this.translate.instant('dashboard.inactivityYellow'),
      RED: this.translate.instant('dashboard.inactivityRed')
    };
    return inactivityLabels[level];
  }

  /**
   * Obtiene el progreso visual de un lote
   */
  getProgressWidth(progress: number): number {
    return Math.min(Math.max(progress, 0), 100);
  }

  /**
   * Formatea fecha estimada de cosecha
   */
  formatHarvestDate(dateString: string): string {
    if (!dateString || dateString === 'null') return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  getDaysLabel(lot: LotProgressDTO): string {
    if (lot.sowingDate === 'null' || lot.totalDays === 0) return '-';
    return `${lot.daysElapsed}/${lot.totalDays} días`;
  }

  getRemainingLabel(lot: LotProgressDTO): string {
    if (lot.sowingDate === 'null') return '';
    if (lot.daysRemaining <= 0) return 'Cosecha lista';
    return `${lot.daysRemaining} días restantes`;
  }

  hasSowing(lot: LotProgressDTO): boolean {
    return lot.sowingDate !== 'null';
  }

  getSowingDateLabel(lot: LotProgressDTO): string {
    if (lot.sowingDate === 'null') return '';
    return this.formatHarvestDate(lot.sowingDate);
  }

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

  get alertLots(): LotStatusDTO[] {
    return this.lotStatuses.filter(l => l.status !== 'GREEN' || l.inactivityLevel !== 'GREEN');
  }

  get hasAlerts(): boolean {
    return this.alertLots.length > 0;
  }
}
