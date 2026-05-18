import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventService } from '../../../core/services/event';
import { EventTypeService, EventType } from '../../../core/services/event-type';
import { LotService } from '../../../core/services/lot';
import { Event } from '../../../models/event.model';
import { Lot } from '../../../models/lot.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { SigmaBtnComponent } from '../../../shared/components/sigma-btn/sigma-btn';
import { SigmaCardComponent } from '../../../shared/components/sigma-card/sigma-card';
import { SigmaBadgeComponent } from '../../../shared/components/sigma-badge/sigma-badge';
import { SigmaEmptyStateComponent } from '../../../shared/components/sigma-empty-state/sigma-empty-state';
import { SigmaInputComponent } from '../../../shared/components/sigma-input/sigma-input';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    MatIconModule,
    SigmaBtnComponent,
    SigmaCardComponent,
    SigmaBadgeComponent,
    SigmaEmptyStateComponent,
    SigmaInputComponent,
  ],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventListComponent implements OnInit, OnDestroy {
  lots: Lot[] = [];
  eventTypes: EventType[] = [];
  events: Event[] = [];

  selectedLotId: number = 0;

  newEvent = { lotId: 0, type: '', userId: 0, timestamp: '', description: '' };
  loading = false;
  submitted = false;

  private destroy$ = new Subject<void>();

  get formErrors(): string[] {
    if (!this.submitted) return [];
    const errors: string[] = [];
    if (!this.newEvent.type) errors.push('events.errors.typeRequired');
    if (!this.newEvent.timestamp) errors.push('events.errors.timestampRequired');
    return errors;
  }

  constructor(
    private eventService: EventService,
    private eventTypeService: EventTypeService,
    private lotService: LotService,
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadLots();
    this.loadEventTypes();
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

  loadLots(): void {
    this.lotService.getAll().subscribe({
      next: (data) => {
        this.lots = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  loadEventTypes(): void {
    this.eventTypeService.getAll().subscribe({
      next: (data) => {
        this.eventTypes = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  loadEvents(): void {
    if (!this.selectedLotId) return;
    const selectedLot = this.lots.find((l) => l.id === this.selectedLotId);
    forkJoin({
      events: this.eventService.getByLot(this.selectedLotId),
      eventTypes: selectedLot
        ? this.eventTypeService.getByCrop(selectedLot.cropId)
        : this.eventTypeService.getAll(),
    }).subscribe({
      next: ({ events, eventTypes }) => {
        this.events = events;
        this.eventTypes = eventTypes;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  createEvent(): void {
    this.submitted = true;
    if (this.formErrors.length) return;
    if (!this.selectedLotId) return;
    this.loading = true;
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
        this.loading = false;
        this.submitted = false;
        this.newEvent = { lotId: 0, type: '', userId: 0, timestamp: '', description: '' };
        this.loadEvents();
      },
      error: () => {
        this.loading = false;
      },
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
