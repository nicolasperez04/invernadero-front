import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authServiceMock: { isAuthenticated: any };

  const setup = (isAuthenticated: boolean) => {
    authServiceMock = { isAuthenticated: vi.fn().mockReturnValue(isAuthenticated) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
      ],
    });
  };

  it('should allow activation when authenticated', () => {
    setup(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    setup(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return false when not authenticated', () => {
    setup(false);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(false);
  });
});
