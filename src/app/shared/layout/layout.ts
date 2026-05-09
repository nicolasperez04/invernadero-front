import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private i18n: I18nService,
  ) {}

  logout() {
    this.auth.logout();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  get userRoles() {
    return this.auth.getUserRoles();
  }

  get username() {
    return this.auth.getUsername() || 'Usuario';
  }

  canAccess(requiredRoles: string[]): boolean {
    return this.auth.hasRole(requiredRoles);
  }

  setLang(lang: string) {
    this.i18n.changeLang(lang);
  }

  currentLang(): string {
    return this.i18n.getCurrentLang();
  }
}
