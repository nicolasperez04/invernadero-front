import { ApplicationConfig, ErrorHandler, Injector, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler';

import { importProvidersFrom } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Factory para crear el loader de traducciones.
 * Carga los archivos JSON de traducción desde assets/i18n/
 *
 * @param http - HttpClient inyectado por Angular
 * @returns TranslateHttpLoader configurado para cargar archivos es.json y en.json
 *
 * @example
 * Archivos esperados:
 * - src/assets/i18n/es.json
 * - src/assets/i18n/en.json
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Configuración principal de la aplicación Angular.
 *
 * Este archivo define todos los providers globales necesarios para la aplicación:
 * - Router: Manejo de rutas
 * - HTTP Client: Comunicación con el backend
 * - Animations: Soporte para animaciones de Angular Material
 * - Translate: Internacionalización (i18n)
 *
 * @usage
 * Esta configuración se aplica en main.ts:
 * ```typescript
 * bootstrapApplication(App, appConfig)
 *   .catch(err => console.error(err));
 * ```
 *
 * @description
 * Providers configurados:
 * 1. provideRouter(routes) - Configura el sistema de rutas
 * 2. provideHttpClient(withInterceptors([...])) - Configura HTTP con interceptors
 * 3. provideAnimations() - Habilita animaciones de Angular Material
 * 4. TranslateModule - Configura i18n con idioma por defecto 'es'
 *
 * @see routes
 * @see authInterceptor
 * @see errorInterceptor
 * @since 1.0.0
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración del router con las rutas definidas en app.routes.ts
    provideRouter(routes),

    // HTTP Client con interceptores para autenticación y manejo de errores
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    // Habilitar animaciones (requerido por Angular Material)
    provideAnimations(),

    // Manejador global de errores para capturar excepciones runtime
    {
      provide: ErrorHandler,
      useFactory: (injector: Injector) => new GlobalErrorHandler(injector),
      deps: [Injector],
    },

    // Configuración de internacionalización (i18n)
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es', // Idioma por defecto si no hay preferencia guardada
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
  ],
};
