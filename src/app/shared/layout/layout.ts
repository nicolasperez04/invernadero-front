import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationBellComponent } from '../notification-bell/notification-bell';
import { Subject, type Observable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  roles: string[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    CommonModule,
    TranslateModule,
    NotificationBellComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  private destroy$ = new Subject<void>();

  navItems: NavItem[] = [
    { path: '/dashboard', icon: 'dashboard', label: 'nav.dashboard', roles: [] },
    { path: '/crops', icon: 'grass', label: 'nav.crops', roles: ['ADMIN', 'OPERATOR'] },
    { path: '/lots', icon: 'place', label: 'nav.lots', roles: ['ADMIN', 'OPERATOR'] },
    { path: '/events', icon: 'event', label: 'nav.events', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
    ];

  pageTitle$!: Observable<string>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private i18n: I18nService,
  ) {}

  ngOnInit(): void {
    this.pageTitle$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let route = this.router.routerState.root.snapshot;
        while (route.firstChild) route = route.firstChild;
        return route.data['title'] || '';
      }),
    );

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      if (window.innerWidth < 1024) {
        this.sidebarCollapsed = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.auth.logout();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  canAccess(roles: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    return this.auth.hasRole(roles);
  }

  get filteredNavItems(): NavItem[] {
    return this.navItems.filter(item => this.canAccess(item.roles));
  }

  get username(): string {
    return this.auth.getUsername() || 'Usuario';
  }

  setLang(lang: string): void {
    this.i18n.changeLang(lang);
  }

  currentLang(): string {
    return this.i18n.getCurrentLang();
  }
}
