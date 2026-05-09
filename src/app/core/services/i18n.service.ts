import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class I18nService {

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');

    const saved = localStorage.getItem('lang') || 'es';
    this.translate.use(saved);
  }

  changeLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  getCurrentLang() {
    return this.translate.currentLang || 'es';
  }
}
