import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationBellComponent } from './notification-bell';
import { NotificationService } from '../../core/services/notification.service';

describe('NotificationBellComponent', () => {
  let component: NotificationBellComponent;
  let fixture: ComponentFixture<NotificationBellComponent>;
  let mockNotificationService: Partial<NotificationService>;

  beforeEach(async () => {
    mockNotificationService = {
      getAll: () => of([]),
      getUnreadCount: () => of({ count: 5 }),
      markAsRead: () => of(void 0),
      markAllAsRead: () => of(void 0),
    };

    await TestBed.configureTestingModule({
      imports: [NotificationBellComponent, TranslateModule.forRoot()],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationBellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load unread count on init', () => {
    expect(component.unreadCount).toBe(5);
  });

  it('should toggle dropdown open and closed', () => {
    expect(component.dropdownOpen).toBe(false);

    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(true);

    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(false);
  });

  it('should format date correctly', () => {
    const today = new Date();
    const todayStr = today.toISOString();
    expect(component.formatDate(todayStr)).toBe('Hoy');

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(component.formatDate(yesterday.toISOString())).toBe('Ayer');

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    expect(component.formatDate(threeDaysAgo.toISOString())).toBe('Hace 3 días');
  });

  it('should return correct icons per level', () => {
    expect(component.getLevelIcon('INFO')).toBe('info');
    expect(component.getLevelIcon('WARNING')).toBe('warning_amber');
    expect(component.getLevelIcon('CRITICAL')).toBe('error');
    expect(component.getLevelIcon('UNKNOWN')).toBe('notifications');
  });
});
