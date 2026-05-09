import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LotService } from '../../../core/services/lot';
import { CropService } from '../../../core/services/crop';
import { AuthService } from '../../../core/services/auth.service';
import { Lot, LotSummary } from '../../../models/lot.model';
import { Crop } from '../../../models/crop.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lot-list',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './lot-list.html',
  styleUrl: './lot-list.css'
})
export class LotListComponent implements OnInit, OnDestroy {

  lots: Lot[] = [];
  crops: Crop[] = [];

  newLot = {
    name: '',
    cropId: 0,
    startDate: '',
    endDate: ''
  };

  editingLotId: number | null = null;
  editingLot: Partial<Lot> = {};

  summary: LotSummary | null = null;
  summaryOpen = false;
  summaryLoading = false;

  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private lotService: LotService,
    private cropService: CropService,
    private authService: AuthService,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  get isAdminOrOperator(): boolean {
    return this.authService.hasRole(['ADMIN', 'OPERATOR']);
  }

  get isEditing(): boolean {
    return this.editingLotId !== null;
  }

  ngOnInit(): void {
    this.loadLots();
    this.loadCrops();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter((event: any) => event.url === '/lots'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadLots();
        this.loadCrops();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLots(): void {
    this.loading = true;
    this.lotService.getAll().subscribe({
      next: data => {
        this.lots = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadCrops(): void {
    this.cropService.getAll().subscribe({
      next: data => {
        this.crops = data;
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  createLot(): void {
    if (!this.newLot.name || !this.newLot.cropId || !this.newLot.startDate) return;

    this.loading = true;
    const payload: any = {
      name: this.newLot.name,
      cropId: this.newLot.cropId,
      startDate: this.toIsoDatetime(this.newLot.startDate)
    };
    if (this.newLot.endDate) {
      payload.endDate = this.toIsoDatetime(this.newLot.endDate);
    }

    this.lotService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(this.translate.instant('lots.success'), this.translate.instant('buttons.ok'), { duration: 3000, panelClass: 'snack-success' });
        this.resetForm();
        this.loadLots();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(this.translate.instant('lots.error'), this.translate.instant('buttons.ok'), { duration: 4000, panelClass: 'snack-error' });
        this.cdr.markForCheck();
      }
    });
  }

  deleteLot(id: number): void {
    this.confirmDialog.confirm('confirm.deleteTitle', 'confirm.deleteMessage').subscribe(
      (confirmed) => {
        if (confirmed) {
          this.loading = true;
          this.lotService.delete(id).subscribe({
            next: () => {
              this.loading = false;
              this.snackBar.open(this.translate.instant('lots.deleteSuccess'), this.translate.instant('buttons.ok'), { duration: 3000, panelClass: 'snack-success' });
              this.loadLots();
              this.cdr.markForCheck();
            },
            error: () => {
              this.loading = false;
              this.snackBar.open(this.translate.instant('lots.error'), this.translate.instant('buttons.ok'), { duration: 4000, panelClass: 'snack-error' });
              this.cdr.markForCheck();
            }
          });
        }
      }
    );
  }

  openSummary(id: number): void {
    this.summaryLoading = true;
    this.summaryOpen = true;
    this.summary = null;
    this.lotService.getSummary(id).subscribe({
      next: data => {
        this.summary = data;
        this.summaryLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.summaryLoading = false;
        this.closeSummary();
        this.snackBar.open(this.translate.instant('lots.error'), this.translate.instant('buttons.ok'), { duration: 4000, panelClass: 'snack-error' });
        this.cdr.markForCheck();
      }
    });
  }

  closeSummary(): void {
    this.summaryOpen = false;
    this.summary = null;
  }

  getCropName(cropId: number): string {
    const crop = this.crops.find(c => c.id === cropId);
    return crop ? crop.name : this.translate.instant('events.noDescription');
  }

  startEdit(lot: Lot): void {
    this.editingLotId = lot.id;
    this.editingLot = { ...lot };
  }

  cancelEdit(): void {
    this.editingLotId = null;
    this.editingLot = {};
  }

  saveEdit(): void {
    if (!this.editingLotId || !this.editingLot.name) return;

    this.loading = true;
    this.lotService.update(this.editingLotId, this.editingLot).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(this.translate.instant('lots.updateSuccess'), this.translate.instant('buttons.ok'), { duration: 3000, panelClass: 'snack-success' });
        this.cancelEdit();
        this.loadLots();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(this.translate.instant('lots.error'), this.translate.instant('buttons.ok'), { duration: 4000, panelClass: 'snack-error' });
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.newLot = { name: '', cropId: 0, startDate: '', endDate: '' };
  }

  private toIsoDatetime(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00.000Z').toISOString();
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      CREATED: this.translate.instant('lots.statusCreated'),
      IN_PRODUCTION: this.translate.instant('lots.statusInProduction'),
      FINISHED: this.translate.instant('lots.statusFinished')
    };
    return map[status] || status;
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      CREATED: 'radio_button_unchecked',
      IN_PRODUCTION: 'agriculture',
      FINISHED: 'check_circle'
    };
    return map[status] || 'help';
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      CREATED: '#9e9e9e',
      IN_PRODUCTION: '#2d7d4d',
      FINISHED: '#1e88e5'
    };
    return map[status] || '#9e9e9e';
  }

  getInactivityLabel(level: string): string {
    const map: Record<string, string> = {
      GREEN: this.translate.instant('lots.inactivityGreen'),
      YELLOW: this.translate.instant('lots.inactivityYellow'),
      RED: this.translate.instant('lots.inactivityRed'),
      GRAY: this.translate.instant('lots.noEvents'),
      UNKNOWN: '-'
    };
    return map[level] || level;
  }

  getInactivityColor(level: string): string {
    const map: Record<string, string> = {
      GREEN: '#4caf50',
      YELLOW: '#ff9800',
      RED: '#f44336',
      GRAY: '#9e9e9e',
      UNKNOWN: '#bdbdbd'
    };
    return map[level] || '#9e9e9e';
  }

  getInactivityIcon(level: string): string {
    const map: Record<string, string> = {
      GREEN: 'check_circle',
      YELLOW: 'warning',
      RED: 'error',
      GRAY: 'remove_circle',
      UNKNOWN: 'help'
    };
    return map[level] || 'help';
  }

  hasSowing(): boolean {
    return !!(this.summary?.sowingDate && this.summary.sowingDate !== 'null');
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr || dateStr === 'null') return this.translate.instant('events.noDescription');
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return this.translate.instant('events.noDescription');
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return this.translate.instant('events.noDescription');
    }
  }

  formatLastEventDate(dateStr: string | null): string {
    if (!dateStr || dateStr === 'null') return this.translate.instant('events.noDescription');
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return this.translate.instant('events.noDescription');
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return this.translate.instant('events.noDescription');
    }
  }

  getProgressPercent(): number {
    if (!this.summary || this.summary.totalDays === 0) return 0;
    return Math.min((this.summary.daysElapsed / this.summary.totalDays) * 100, 100);
  }

  getProgressDaysLabel(): string {
    if (!this.summary || this.summary.totalDays === 0 || !this.hasSowing()) return this.translate.instant('events.noDescription');
    return `${this.summary.daysElapsed} / ${this.summary.totalDays} ${this.translate.instant('lots.days')}`;
  }

  getRemainingLabel(): string {
    if (!this.summary || !this.hasSowing()) return '';
    if (this.summary.daysRemaining > 0) {
      return `${this.summary.daysRemaining} ${this.translate.instant('lots.daysRemainingLabel')}`;
    }
    return this.translate.instant('lots.harvestReady');
  }

  getEventTypeLabel(type: string | null): string {
    if (!type) return this.translate.instant('events.noDescription');
    return this.translate.instant('events.eventTypes.' + type) || type;
  }

  getEventFrequencyLabel(): string {
    if (!this.summary) return this.translate.instant('events.noDescription');
    return this.summary.eventFrequency.toFixed(2);
  }
}