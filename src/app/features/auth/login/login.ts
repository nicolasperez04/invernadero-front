import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { SigmaBtnComponent } from '../../../shared/components/sigma-btn/sigma-btn';
import { SigmaInputComponent } from '../../../shared/components/sigma-input/sigma-input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    MatIconModule,
    SigmaBtnComponent,
    SigmaInputComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  hidePassword = true;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  login(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.translate.instant('login.invalidCredentials');
        console.error('Error de login:', err);
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
