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

import { MatIconModule } from '@angular/material/icon';
import { SigmaBtnComponent } from '../../../shared/components/sigma-btn/sigma-btn';
import { SigmaCardComponent } from '../../../shared/components/sigma-card/sigma-card';
import { SigmaBadgeComponent } from '../../../shared/components/sigma-badge/sigma-badge';
import { SigmaSpinnerComponent } from '../../../shared/components/sigma-spinner/sigma-spinner';
import { SigmaEmptyStateComponent } from '../../../shared/components/sigma-empty-state/sigma-empty-state';
import { SigmaInputComponent } from '../../../shared/components/sigma-input/sigma-input';
import { SigmaProgressComponent } from '../../../shared/components/sigma-progress/sigma-progress';

@Component({
  selector: 'app-lot-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    MatIconModule,
    SigmaBtnComponent,
    SigmaCardComponent,
    SigmaBadgeComponent,
    SigmaSpinnerComponent,
    SigmaEmptyStateComponent,
    SigmaInputComponent,
    SigmaProgressComponent,
  ],
  templateUrl: './lot-list.html',
  styleUrl: './lot-list.css',
})
export class LotListComponent implements OnInit, OnDestroy {
  lots: Lot[] = [];
  crops: Crop[] = [];

  newLot = { name: '', cropId: 0, startDate: '', endDate: '' };
  editingLotId: number | null = null;
  editingLot: Partial<Lot> = {};

  summary: LotSummary | null = null;
  summaryOpen = false;
  summaryLoading = false;

  selectedStatus: string = '';
  statusOptions: string[] = ['CREATED', 'IN_PRODUCTION', 'FINISHED'];

  loading = false;
  submitted = false;
  editSubmitted = false;

  readonly lotColumns = [
    { key: 'name', labelKey: 'lots.name' },
    { key: 'cropName', labelKey: 'lots.crop' },
    { key: 'status', labelKey: 'lots.status' },
    { key: 'startDate', labelKey: 'lots.startDate' },
    { key: 'endDate', labelKey: 'lots.endDate' },
    { key: 'actions', labelKey: 'lots.actions', class: 'tc' },
  ];

  readonly getLotRowClass = (row: any) => (this.editingLotId === row.id ? 'row-active' : undefined);

  private destroy$ = new Subject<void>();

  get formErrors(): string[] {
    if (!this.submitted) return [];
    const errors: string[] = [];
    if (!this.newLot.name || this.newLot.name.trim().length < 2)
      errors.push('lots.errors.nameRequired');
    if (!this.newLot.cropId || this.newLot.cropId === 0) errors.push('lots.errors.cropRequired');
    if (!this.newLot.startDate) errors.push('lots.errors.startDateRequired');
    return errors;
  }

  get editFormErrors(): string[] {
    if (!this.editSubmitted) return [];
    const errors: string[] = [];
    if (!this.editingLot.name || this.editingLot.name.trim().length < 2)
      errors.push('lots.errors.nameRequired');
    return errors;
  }

  constructor(
    private lotService: LotService,
    private cropService: CropService,
    private authService: AuthService,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
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
        filter((event) => event instanceof NavigationEnd),
        filter((event: any) => event.url === '/lots'),
        takeUntil(this.destroy$),
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
    const obs = this.selectedStatus
      ? this.lotService.getAll({ status: this.selectedStatus })
      : this.lotService.getAll();
    obs.subscribe({
      next: (data) => {
        this.lots = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadCrops(): void {
    this.cropService.getAll().subscribe({
      next: (data) => {
        this.crops = data;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  createLot(): void {
    this.submitted = true;
    if (this.formErrors.length) return;
    this.loading = true;
    const payload: any = {
      name: this.newLot.name,
      cropId: this.newLot.cropId,
      startDate: this.toIsoDatetime(this.newLot.startDate),
    };
    if (this.newLot.endDate) payload.endDate = this.toIsoDatetime(this.newLot.endDate);
    this.lotService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('lots.success'),
          this.translate.instant('buttons.ok'),
          { duration: 3000, panelClass: 'snack-success' },
        );
        this.resetForm();
        this.loadLots();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('lots.error'),
          this.translate.instant('buttons.ok'),
          { duration: 4000, panelClass: 'snack-error' },
        );
        this.cdr.markForCheck();
      },
    });
  }

  deleteLot(id: number): void {
    this.confirmDialog
      .confirm('confirm.deleteTitle', 'confirm.deleteMessage')
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.loading = true;
        this.lotService.delete(id).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open(
              this.translate.instant('lots.deleteSuccess'),
              this.translate.instant('buttons.ok'),
              { duration: 3000, panelClass: 'snack-success' },
            );
            this.loadLots();
            this.cdr.markForCheck();
          },
          error: () => {
            this.loading = false;
            this.snackBar.open(
              this.translate.instant('lots.error'),
              this.translate.instant('buttons.ok'),
              { duration: 4000, panelClass: 'snack-error' },
            );
            this.cdr.markForCheck();
          },
        });
      });
  }

  openSummary(id: number): void {
    this.summaryLoading = true;
    this.summaryOpen = true;
    this.summary = null;
    this.lotService.getSummary(id).subscribe({
      next: (data) => {
        this.summary = data;
        this.summaryLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.summaryLoading = false;
        this.closeSummary();
        this.snackBar.open(
          this.translate.instant('lots.error'),
          this.translate.instant('buttons.ok'),
          { duration: 4000, panelClass: 'snack-error' },
        );
        this.cdr.markForCheck();
      },
    });
  }

  closeSummary(): void {
    this.summaryOpen = false;
    this.summary = null;
  }

  getCropName(cropId: number): string {
    const crop = this.crops.find((c) => c.id === cropId);
    return crop ? crop.name : this.translate.instant('events.noDescription');
  }

  startEdit(lot: Lot): void {
    this.editingLotId = lot.id;
    this.editingLot = { ...lot };
    this.editSubmitted = false;
  }
  cancelEdit(): void {
    this.editSubmitted = false;
    this.editingLotId = null;
    this.editingLot = {};
  }

  saveEdit(): void {
    this.editSubmitted = true;
    if (this.editFormErrors.length) return;
    this.loading = true;
    this.lotService.update(this.editingLotId!, this.editingLot).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('lots.updateSuccess'),
          this.translate.instant('buttons.ok'),
          { duration: 3000, panelClass: 'snack-success' },
        );
        this.cancelEdit();
        this.loadLots();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(
          this.translate.instant('lots.error'),
          this.translate.instant('buttons.ok'),
          { duration: 4000, panelClass: 'snack-error' },
        );
        this.cdr.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.newLot = { name: '', cropId: 0, startDate: '', endDate: '' };
  }

  private toIsoDatetime(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00.000Z').toISOString();
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      CREATED: this.translate.instant('lots.statusCreated'),
      IN_PRODUCTION: this.translate.instant('lots.statusInProduction'),
      FINISHED: this.translate.instant('lots.statusFinished'),
    };
    return map[status] || status;
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      CREATED: '#9e9e9e',
      IN_PRODUCTION: '#F5A623',
      FINISHED: '#4E965B',
    };
    return map[status] || '#9e9e9e';
  }

  getBadgeColor(status: string): 'green' | 'amber' | 'red' | 'blue' | 'gray' {
    const map: Record<string, 'green' | 'amber' | 'red' | 'blue' | 'gray'> = {
      CREATED: 'gray',
      IN_PRODUCTION: 'amber',
      FINISHED: 'green',
    };
    return map[status] || 'gray';
  }

  getInactivityLabel(level: string): string {
    const map: Record<string, string> = {
      GREEN: this.translate.instant('lots.inactivityGreen'),
      YELLOW: this.translate.instant('lots.inactivityYellow'),
      RED: this.translate.instant('lots.inactivityRed'),
      GRAY: this.translate.instant('lots.noEvents'),
      UNKNOWN: '-',
    };
    return map[level] || level;
  }

  getInactivityColor(level: string): string {
    const map: Record<string, string> = {
      GREEN: '#4E965B',
      YELLOW: '#F5A623',
      RED: '#C94A4A',
      GRAY: '#9E9E9E',
      UNKNOWN: '#BDBDBD',
    };
    return map[level] || '#9E9E9E';
  }

  getInactivityBadgeColor(level: string): 'green' | 'amber' | 'red' | 'blue' | 'gray' {
    const map: Record<string, 'green' | 'amber' | 'red' | 'blue' | 'gray'> = {
      GREEN: 'green',
      YELLOW: 'amber',
      RED: 'red',
      GRAY: 'gray',
      UNKNOWN: 'gray',
    };
    return map[level] || 'gray';
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
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return this.translate.instant('events.noDescription');
    }
  }

  getProgressPercent(): number {
    if (!this.summary || this.summary.totalDays === 0) return 0;
    return Math.min((this.summary.daysElapsed / this.summary.totalDays) * 100, 100);
  }

  getProgressDaysLabel(): string {
    if (!this.summary || this.summary.totalDays === 0 || !this.hasSowing())
      return this.translate.instant('events.noDescription');
    return `${this.summary.daysElapsed} / ${this.summary.totalDays} ${this.translate.instant('lots.days')}`;
  }

  getRemainingLabel(): string {
    if (!this.summary || !this.hasSowing()) return '';
    if (this.summary.daysRemaining > 0)
      return `${this.summary.daysRemaining} ${this.translate.instant('lots.daysRemainingLabel')}`;
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

  downloadReport(id: number, lotName: string): void {
    this.lotService.getReport(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `informe_cosecha_${lotName}_${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () =>
        this.snackBar.open(
          this.translate.instant('lots.reportError'),
          this.translate.instant('buttons.ok'),
          { duration: 4000, panelClass: 'snack-error' },
        ),
    });
  }
}
