import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ data.title | translate }}</h2>
    <mat-dialog-content>{{ data.message | translate }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'confirm.no' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">
        {{ 'confirm.yes' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {}

  /**
   * Abre un dialog de confirmación y retorna un Observable<boolean>
   * @param titleKey - Clave de traducción para el título (ej: 'confirm.deleteTitle')
   * @param messageKey - Clave de traducción para el mensaje (ej: 'confirm.deleteMessage')
   */
  confirm(titleKey: string, messageKey: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: false,
      data: {
        title: titleKey,
        message: messageKey,
      },
    });

    return dialogRef.afterClosed();
  }
}
