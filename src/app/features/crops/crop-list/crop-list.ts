import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CropService } from '../../../core/services/crop';
import { AuthService } from '../../../core/services/auth.service';
import { Crop } from '../../../models/crop.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin, Observable } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { EventTypeService, EventType } from '../../../core/services/event-type';
import { CropEventTypesDialogComponent } from '../../../shared/components/crop-event-types-dialog/crop-event-types-dialog';
import { SigmaBtnComponent } from '../../../shared/components/sigma-btn/sigma-btn';
import { SigmaCardComponent } from '../../../shared/components/sigma-card/sigma-card';
import { SigmaBadgeComponent } from '../../../shared/components/sigma-badge/sigma-badge';
import { SigmaSpinnerComponent } from '../../../shared/components/sigma-spinner/sigma-spinner';
import { SigmaInputComponent } from '../../../shared/components/sigma-input/sigma-input';
import {
  SigmaTableComponent,
  SigmaCellDirective,
  SigmaColumn,
} from '../../../shared/components/sigma-table/sigma-table';

@Component({
  selector: 'app-crop-list',
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
    SigmaInputComponent,
    SigmaTableComponent,
    SigmaCellDirective,
    CropEventTypesDialogComponent,
  ],
  templateUrl: './crop-list.html',
  styleUrl: './crop-list.css',
})
export class CropListComponent implements OnInit, OnDestroy {
  crops: Crop[] = [];
  newCrop: Partial<Crop> = {
    name: '',
    description: '',
    estimatedGrowthDays: 0,
    inactivityDaysThreshold: 0,
  };
  editingCropId: number | null = null;
  loading = false;
  submitted = false;

  dialogVisible = false;
  dialogLoading = false;
  dialogCropId = 0;
  dialogCropName = '';
  dialogAllEventTypes: EventType[] = [];
  dialogAssignedIds: Set<number> = new Set();

  readonly cropColumns = [
    { key: 'name', labelKey: 'crops.name' },
    { key: 'description', labelKey: 'crops.description', class: 'desc' },
    { key: 'estimatedGrowthDays', labelKey: 'crops.estimatedGrowthDays', class: 'tc' },
    { key: 'inactivityDaysThreshold', labelKey: 'crops.inactivityDaysThreshold', class: 'tc' },
    { key: 'irrigationFrequencyHours', labelKey: 'crops.irrigationFrequencyHours', class: 'tc' },
    {
      key: 'recommendedFertilizationDays',
      labelKey: 'crops.recommendedFertilizationDays',
      class: 'tc',
    },
    {
      key: 'recommendedPestControlDays',
      labelKey: 'crops.recommendedPestControlDays',
      class: 'tc',
    },
    { key: 'actions', labelKey: 'crops.actions', class: 'tc' },
  ];

  getCropRowClass = (row: any) => (this.editingCropId === row.id ? 'row-active' : undefined);

  private destroy$ = new Subject<void>();

  get formErrors(): string[] {
    if (!this.submitted) return [];
    const errors: string[] = [];
    if (!this.newCrop.name || this.newCrop.name.trim().length < 2)
      errors.push('crops.errors.nameRequired');
    if (!this.newCrop.estimatedGrowthDays || this.newCrop.estimatedGrowthDays < 1)
      errors.push('crops.errors.growthDaysRequired');
    if (!this.newCrop.inactivityDaysThreshold || this.newCrop.inactivityDaysThreshold < 1)
      errors.push('crops.errors.inactivityRequired');
    return errors;
  }

  constructor(
    private cropService: CropService,
    private authService: AuthService,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private eventTypeService: EventTypeService,
  ) {}

  get isAdmin(): boolean {
    return this.authService.hasRole(['ADMIN']);
  }
  get isEditing(): boolean {
    return this.editingCropId !== null;
  }

  ngOnInit(): void {
    this.loadCrops();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter((event: any) => event.url === '/crops'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.loadCrops());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCrops(): void {
    this.loading = true;
    this.cropService.getAll().subscribe({
      next: (data) => {
        this.crops = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  createOrUpdate(): void {
    this.submitted = true;
    if (this.formErrors.length) return;
    this.editingCropId !== null ? this.saveEdit() : this.createCrop();
  }

  createCrop(): void {
    this.loading = true;
    this.cropService.create(this.newCrop).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Cultivo creado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: 'snack-success',
        });
        this.resetForm();
        this.loadCrops();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al crear el cultivo', 'Cerrar', {
          duration: 4000,
          panelClass: 'snack-error',
        });
        this.cdr.markForCheck();
      },
    });
  }

  startEdit(crop: Crop): void {
    this.editingCropId = crop.id;
    this.newCrop = { ...crop };
    this.submitted = false;
  }
  cancelEdit(): void {
    this.editingCropId = null;
    this.resetForm();
  }

  saveEdit(): void {
    if (!this.editingCropId || !this.newCrop.name) return;
    this.loading = true;
    this.cropService.update(this.editingCropId, this.newCrop).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Cultivo actualizado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: 'snack-success',
        });
        this.cancelEdit();
        this.loadCrops();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al actualizar el cultivo', 'Cerrar', {
          duration: 4000,
          panelClass: 'snack-error',
        });
        this.cdr.markForCheck();
      },
    });
  }

  deleteCrop(id: number): void {
    this.confirmDialog
      .confirm('confirm.deleteTitle', 'confirm.deleteMessage')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.loading = true;
          this.cropService.delete(id).subscribe({
            next: () => {
              this.loading = false;
              this.snackBar.open('Cultivo eliminado', 'Cerrar', {
                duration: 3000,
                panelClass: 'snack-success',
              });
              this.loadCrops();
              this.cdr.markForCheck();
            },
            error: () => {
              this.loading = false;
              this.snackBar.open('Error al eliminar el cultivo', 'Cerrar', {
                duration: 4000,
                panelClass: 'snack-error',
              });
              this.cdr.markForCheck();
            },
          });
        }
      });
  }

  openEventTypesDialog(cropId: number, cropName: string): void {
    this.dialogLoading = true;
    this.dialogVisible = true;
    forkJoin({
      allEventTypes: this.eventTypeService.getAll(),
      assignedTypes: this.cropService.getEventTypes(cropId),
    }).subscribe({
      next: ({ allEventTypes, assignedTypes }) => {
        this.dialogLoading = false;
        this.dialogCropId = cropId;
        this.dialogCropName = cropName;
        this.dialogAllEventTypes = allEventTypes;
        this.dialogAssignedIds = new Set(assignedTypes.map((et: EventType) => et.id));
        this.cdr.markForCheck();
      },
      error: () => {
        this.dialogLoading = false;
        this.dialogVisible = false;
        this.snackBar.open('Error al cargar tipos de evento', 'Cerrar', {
          duration: 4000,
          panelClass: 'snack-error',
        });
        this.cdr.markForCheck();
      },
    });
  }

  onDialogClose(result: Set<number> | null): void {
    this.dialogVisible = false;
    if (!result) return;
    const toAdd = this.dialogAllEventTypes.filter(
      (et) => result.has(et.id) && !this.dialogAssignedIds.has(et.id),
    );
    const toRemove = this.dialogAllEventTypes.filter(
      (et) => !result.has(et.id) && this.dialogAssignedIds.has(et.id),
    );
    const operations: Observable<any>[] = [
      ...toAdd.map((et) => this.cropService.addEventType(this.dialogCropId, et.id)),
      ...toRemove.map((et) => this.cropService.removeEventType(this.dialogCropId, et.id)),
    ];
    if (operations.length === 0) return;
    forkJoin(operations).subscribe({
      next: () =>
        this.snackBar.open('Tipos de evento actualizados exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: 'snack-success',
        }),
      error: () =>
        this.snackBar.open('Error al actualizar tipos de evento', 'Cerrar', {
          duration: 4000,
          panelClass: 'snack-error',
        }),
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.newCrop = {
      name: '',
      description: '',
      estimatedGrowthDays: 0,
      inactivityDaysThreshold: 0,
      irrigationFrequencyHours: 0,
      recommendedFertilizationDays: 0,
      recommendedPestControlDays: 0,
    };
  }
}
