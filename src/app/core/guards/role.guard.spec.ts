import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authServiceMock: { isAuthenticated: any; hasRole: any; getUserRoles: any };
  let routerMock: { navigate: any; url: string };

  const setup = (isAuthenticated: boolean, hasRole: boolean, userRoles: string[] = []) => {
    authServiceMock = {
      isAuthenticated: vi.fn().mockReturnValue(isAuthenticated),
      hasRole: vi.fn().mockReturnValue(hasRole),
      getUserRoles: vi.fn().mockReturnValue(userRoles),
    };
    routerMock = {
      navigate: vi.fn(),
      url: '/admin',
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  };

  it('should allow access with correct role', () => {
    setup(true, true, ['ADMIN']);

    const route = { data: { roles: ['ADMIN'] } } as any;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));

    expect(result).toBe(true);
  });

  it('should deny access without required role and redirect to dashboard', () => {
    setup(true, false, ['VIEWER']);

    const route = { data: { roles: ['ADMIN'] } } as any;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to login when not authenticated', () => {
    setup(false, false);

    const route = { data: { roles: ['ADMIN'] } } as any;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access when no roles specified', () => {
    setup(true, false);

    const route = { data: {} } as any;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));

    expect(result).toBe(true);
  });

  it('should allow access when undefined roles', () => {
    const route = { data: {} } as any;
    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as any));
    expect(result).toBe(true);
  });
});
