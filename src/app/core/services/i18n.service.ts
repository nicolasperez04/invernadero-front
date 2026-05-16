import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Servicio de internacionalización (i18n) de la aplicación.
 * Maneja el cambio de idioma y la persistencia de la preferencia del usuario.
 *
 * @usage
 * ```typescript
 * const i18n = inject(I18nService);
 * // Cambiar idioma
 * i18n.changeLang('en');
 * // Obtener idioma actual
 * const lang = i18n.getCurrentLang();
 * ```
 *
 * @example
 * ```html
 * <!-- En templates -->
 * <button (click)="i18n.changeLang('es')">Español</button>
 * <button (click)="i18n.changeLang('en')">English</button>
 * {{ 'HOME.TITLE' | translate }}
 * ```
 *
 * @see TranslateService
 * @since 1.0.0
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  /** Idioma por defecto si no hay preferencia guardada */
  private static readonly DEFAULT_LANG = 'es';
  /** Clave en localStorage para guardar el idioma */
  private static readonly STORAGE_KEY = 'lang';

  constructor(private translate: TranslateService) {
    // Establecer idioma por defecto como fallback
    this.translate.setDefaultLang(I18nService.DEFAULT_LANG);

    // Cargar preferencia guardada o usar defecto
    const savedLang = localStorage.getItem(I18nService.STORAGE_KEY) || I18nService.DEFAULT_LANG;
    this.translate.use(savedLang);
  }

  /**
   * Cambia el idioma de la aplicación.
   * Guarda la preferencia en localStorage y actualiza el servicio de traducción.
   *
   * @param lang - Código de idioma ('es' para español, 'en' para inglés)
   * @sideEffect Actualiza localStorage y el idioma activo del TranslateService
   *
   * @example
   * ```typescript
   * i18nService.changeLang('en'); // Cambiar a inglés
   * i18nService.changeLang('es'); // Cambiar a español
   * ```
   */
  changeLang(lang: string): void {
    localStorage.setItem(I18nService.STORAGE_KEY, lang);
    this.translate.use(lang);
  }

  /**
   * Obtiene el idioma actualmente activo en la aplicación.
   *
   * @returns Código del idioma actual ('es' | 'en')
   *
   * @example
   * ```typescript
   * const currentLang = i18nService.getCurrentLang();
   * console.log(`Idioma: ${currentLang}`);
   * ```
   */
  getCurrentLang(): string {
    return this.translate.currentLang || I18nService.DEFAULT_LANG;
  }
}
