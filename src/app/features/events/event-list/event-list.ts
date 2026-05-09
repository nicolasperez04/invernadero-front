import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../../core/services/event';
import { EventTypeService, EventType } from '../../../core/services/event-type';
import { LotService } from '../../../core/services/lot';
import { Event } from '../../../models/event.model';
import { Lot } from '../../../models/lot.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventListComponent implements OnInit, OnDestroy {
  lots: Lot[] = [];
  eventTypes: EventType[] = [];
  events: Event[] = [];
  displayedColumns: string[] = ['timestamp', 'type', 'description'];

  selectedLotId: number = 0;

  newEvent = {
    lotId: 0,
    type: '',
    userId: 0,
    timestamp: '',
    description: '',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private eventTypeService: EventTypeService,
    private lotService: LotService,
    private confirmDialog: ConfirmDialogService,
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Cargar datos inicialmente
    this.loadLots();
    this.loadEventTypes();

    // Cargar datos cada vez que se navega a esta ruta
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter((event: any) => event.url === '/events'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.loadLots();
        this.loadEventTypes();
        this.selectedLotId = 0;
        this.events = [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLots() {
    this.lotService.getAll().subscribe({
      next: (data) => {
        this.lots = data;
        this.cdr.markForCheck();
      },
      error: () => {
        // Error interceptor maneja la visualización del snackbar
      },
    });
  }

  loadEventTypes() {
    this.eventTypeService.getAll().subscribe({
      next: (data) => {
        this.eventTypes = data;
        this.cdr.markForCheck();
      },
      error: () => {
        // Error interceptor maneja la visualización del snackbar
      },
    });
  }

  loadEvents() {
    if (!this.selectedLotId) return;

    this.eventService.getByLot(this.selectedLotId).subscribe({
      next: (data) => {
        this.events = data;
        this.cdr.markForCheck();
      },
      error: () => {
        // Error interceptor maneja la visualización del snackbar
      },
    });
  }

  createEvent() {
    if (!this.selectedLotId || !this.newEvent.type || !this.newEvent.timestamp) {
      return;
    }

    const timestamp =
      this.newEvent.timestamp.length === 16
        ? this.newEvent.timestamp + ':00.000Z'
        : this.newEvent.timestamp;

    const payload = {
      ...this.newEvent,
      lotId: this.selectedLotId,
      userId: this.auth.getUserId(),
      timestamp,
    };

    this.eventService.create(payload).subscribe({
      next: () => {
        this.newEvent = {
          lotId: 0,
          type: '',
          userId: 0,
          timestamp: '',
          description: '',
        };
        this.loadEvents();
      },
      error: () => {},
    });
  }

  getLotName(lotId: number): string {
    const lot = this.lots.find((l) => l.id === lotId);
    return lot ? lot.name : '-';
  }

  translateType(type: string): string {
    return this.translate.instant(`events.eventTypes.${type}`);
  }
}
