import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.api}/login`, {
      email,
      password,
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Validar que no esté expirado
    const payload = this.decodeToken();
    if (!payload) return false;

    const exp = payload.exp;
    if (exp) {
      const expirationTime = exp * 1000; // convertir a milliseconds
      const currentTime = Date.now();
      if (currentTime >= expirationTime) {
        // Token expirado, logout
        this.logout();
        return false;
      }
    }

    return true;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    return jwtDecode(token);
  }

  getUsername(): string | null {
    const payload = this.getPayload();
    return payload?.sub || null;
  }

  /**
   * Obtiene todos los roles del usuario.
   * Soporta múltiples roles en el array authorities.
   */
  getUserRoles(): string[] {
    const payload = this.getPayload();

    if (!payload?.authorities || !Array.isArray(payload.authorities)) {
      return [];
    }

    // Remover prefijo ROLE_ de cada autoridad
    return payload.authorities.map((auth: string) => auth.replace('ROLE_', ''));
  }

  /**
   * Obtiene el primer rol (para compatibilidad hacia atrás).
   * @deprecated Usar getUserRoles() o hasRole() en su lugar.
   */
  getUserRole(): string | null {
    const roles = this.getUserRoles();
    return roles.length > 0 ? roles[0] : null;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles solicitados.
   * @param requiredRoles array de roles permitidos (ej. ['ADMIN', 'OPERATOR'])
   */
  hasRole(requiredRoles: string[]): boolean {
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true; // Sin requisitos = permitido
    }

    const userRoles = this.getUserRoles();
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  getUserId(): number {
    const payload = this.getPayload();
    return payload?.userId;
  }
}
