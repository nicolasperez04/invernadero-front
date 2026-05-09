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
import { Subject } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crop-list',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, MatButtonModule, MatIconModule],
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

  private destroy$ = new Subject<void>();

  constructor(
    private cropService: CropService,
    private authService: AuthService,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
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
      .subscribe(() => {
        this.loadCrops();
      });
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
    if (!this.newCrop.name) return;

    if (this.editingCropId !== null) {
      this.saveEdit();
    } else {
      this.createCrop();
    }
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
      error: (err) => {
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

  resetForm(): void {
    this.newCrop = {
      name: '',
      description: '',
      estimatedGrowthDays: 0,
      inactivityDaysThreshold: 0,
    };
  }
}
