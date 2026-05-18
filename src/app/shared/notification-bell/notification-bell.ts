import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationDTO } from '../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: NotificationDTO[] = [];
  unreadCount = 0;
  dropdownOpen = false;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.refresh();
    }
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  refresh(): void {
    this.notificationService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.notifications = list;
      });
    this.loadCount();
  }

  loadCount(): void {
    this.notificationService
      .getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.unreadCount = res.count;
      });
  }

  markAsRead(id: number): void {
    this.notificationService
      .markAsRead(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refresh();
      });
  }

  markAllAsRead(): void {
    this.notificationService
      .markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refresh();
      });
  }

  getLevelIcon(level: string): string {
    switch (level) {
      case 'INFO':
        return 'info';
      case 'WARNING':
        return 'warning_amber';
      case 'CRITICAL':
        return 'error';
      default:
        return 'notifications';
    }
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'INFO':
        return '#4A7CC9';
      case 'WARNING':
        return '#F5A623';
      case 'CRITICAL':
        return '#C94A4A';
      default:
        return '#8D7E6E';
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Ayer';
    return `Hace ${diff} días`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.dropdownOpen && !target.closest('.notification-bell')) {
      this.closeDropdown();
    }
  }
}
