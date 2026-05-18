import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

const mockToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQHRlc3QuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfT1BFUkFUT1IiXSwidXNlcklkIjoxLCJleHAiOjk5OTk5OTk5OTl9.test';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call POST /auth/login with credentials', () => {
      const dummyToken = 'test-token-123';
      service.login('test@test.com', 'password123').subscribe((res) => {
        expect(res.token).toBe(dummyToken);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@test.com', password: 'password123' });
      req.flush({ token: dummyToken });
    });
  });

  describe('saveToken / getToken', () => {
    it('saveToken should store token in localStorage', () => {
      service.saveToken('my-jwt');
      expect(localStorage.getItem('token')).toBe('my-jwt');
    });

    it('getToken should retrieve token from localStorage', () => {
      localStorage.setItem('token', 'stored-jwt');
      expect(service.getToken()).toBe('stored-jwt');
    });

    it('getToken should return null when no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when token is expired', () => {
      localStorage.setItem('token', 'expired-token');
      vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 60 });
      const navigateSpy = vi.fn();
      (service as any).router = { navigate: navigateSpy };

      expect(service.isAuthenticated()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should return true with valid token', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({
        sub: 'user@test.com',
        authorities: ['ROLE_ADMIN'],
        userId: 1,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });

      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should remove token and navigate to /login', () => {
      localStorage.setItem('token', 'some-token');
      const navigateSpy = vi.fn();
      (service as any).router = { navigate: navigateSpy };

      service.logout();
      expect(localStorage.getItem('token')).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getPayload / decodeToken', () => {
    it('decodeToken should return decoded payload', () => {
      localStorage.setItem('token', mockToken);
      const payload = { sub: 'user@test.com', authorities: ['ROLE_ADMIN'] };
      vi.mocked(jwtDecode).mockReturnValue(payload);

      expect(service.decodeToken()).toEqual(payload);
    });

    it('decodeToken should return null without token', () => {
      expect(service.decodeToken()).toBeNull();
    });
  });

  describe('getUserRoles', () => {
    it('should extract roles from JWT payload', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({
        authorities: ['ROLE_ADMIN', 'ROLE_OPERATOR'],
      });

      const roles = service.getUserRoles();
      expect(roles).toEqual(['ADMIN', 'OPERATOR']);
    });

    it('should return empty array when no authorities', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({});

      expect(service.getUserRoles()).toEqual([]);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the required role', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({
        authorities: ['ROLE_ADMIN'],
      });

      expect(service.hasRole(['ADMIN'])).toBe(true);
    });

    it('should return false when user does not have the required role', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({
        authorities: ['ROLE_VIEWER'],
      });

      expect(service.hasRole(['ADMIN'])).toBe(false);
    });

    it('should return true when no roles specified', () => {
      expect(service.hasRole([])).toBe(true);
    });
  });

  describe('getUserId', () => {
    it('should extract userId from payload', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({ userId: 42 });

      expect(service.getUserId()).toBe(42);
    });
  });

  describe('getUsername', () => {
    it('should extract sub as username', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({ sub: 'admin@test.com' });

      expect(service.getUsername()).toBe('admin@test.com');
    });

    it('should return null when no sub', () => {
      localStorage.setItem('token', mockToken);
      vi.mocked(jwtDecode).mockReturnValue({});

      expect(service.getUsername()).toBeNull();
    });
  });
});
