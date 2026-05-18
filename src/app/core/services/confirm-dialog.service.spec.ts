import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ConfirmDialogService, ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialogMock: { open: any };
  let translateMock: { use: any; currentLang: string };

  beforeEach(() => {
    dialogMock = {
      open: vi.fn(),
    };
    translateMock = {
      use: vi.fn(),
      currentLang: 'es',
    };

    TestBed.configureTestingModule({
      providers: [
        ConfirmDialogService,
        { provide: MatDialog, useValue: dialogMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    service = TestBed.inject(ConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('confirm', () => {
    it('should open dialog with correct config', () => {
      const afterClosed$ = of(true);
      dialogMock.open.mockReturnValue({ afterClosed: () => afterClosed$ });

      service.confirm('confirm.deleteTitle', 'confirm.deleteMessage').subscribe((result) => {
        expect(result).toBe(true);
      });

      expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        width: '400px',
        disableClose: false,
        data: {
          title: 'confirm.deleteTitle',
          message: 'confirm.deleteMessage',
        },
      });
    });
  });
});

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let dialogRefMock: { close: any };

  beforeEach(() => {
    dialogRefMock = { close: vi.fn() };

    component = new ConfirmDialogComponent(dialogRefMock as unknown as MatDialogRef<ConfirmDialogComponent>, {
      title: 'test.title',
      message: 'test.message',
    } as ConfirmDialogData);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancel', () => {
    it('should close dialog with false', () => {
      component.onCancel();
      expect(dialogRefMock.close).toHaveBeenCalledWith(false);
    });
  });

  describe('onConfirm', () => {
    it('should close dialog with true', () => {
      component.onConfirm();
      expect(dialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });
});
