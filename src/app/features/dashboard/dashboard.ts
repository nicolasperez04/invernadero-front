import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

import { NgxChartsModule } from '@swimlane/ngx-charts';

interface Crop {
  id: number;
  name: string;
  description?: string;
}

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatIconModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Data
  eventChart: EventChartDTO | null = null;
  lotStatuses: LotStatusDTO[] = [];
  lotProgress: LotProgressDTO[] = [];
  crops: Crop[] = [];

  // UI State
  selectedCropId: number | null = null;
  loading = false;
  errorMessage = '';

  // Chart data for SVG rendering
  chartMaxValue = 0;
  chartWidth = 1200;
  chartHeight = 250;

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

        // Calcular max valor para gráfica
        if (this.eventChart?.values.length) {
          this.chartMaxValue = Math.max(...this.eventChart.values, 1);
        }

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.errorMessage = this.translate.instant('dashboard.loadingError');
        this.loading = false;
        this.cdr.markForCheck();
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
   * Calcula altura de la barra en la gráfica
   */
  getBarHeight(value: number): number {
    if (this.chartMaxValue === 0) return 0;
    return (value / this.chartMaxValue) * this.chartHeight;
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

  get chartLabelsFormatted(): string[] {
    if (!this.eventChart?.labels) return [];
    return this.eventChart.labels.map(d => {
      const date = new Date(d + 'T00:00:00');
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
      const dayNum = date.getDate().toString().padStart(2, '0');
      return `${dayName} ${dayNum}`;
    });
  }

  get chartData(): ChartData[] {
    if (!this.eventChart?.labels || !this.eventChart?.values) return [];
    return this.eventChart.labels.map((label, i) => ({
      name: this.formatDateLabel(label),
      value: this.eventChart!.values[i]
    }));
  }

  private formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }

  colorScheme: any = {
    name: 'greenhouse',
    selectable: true,
    group: 'Ordinal',
    domain: ['#2d7d4d', '#1e88e5', '#7b1fa2', '#f57c00', '#e91e63', '#00bcd4']
  };

  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  animations = true;
  xAxisLabel = 'Fecha';
  yAxisLabel = 'Eventos';
}
