import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  const language = localStorage.getItem('lang') || 'es';

  if (req.url.includes('/auth/login')) {
    // Enviar Accept-Language incluso en login
    const cloned = req.clone({
      setHeaders: {
        'Accept-Language': language
      }
    });
    return next(cloned);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': language
      }
    });

    return next(cloned);
  }

  return next(req);
};
