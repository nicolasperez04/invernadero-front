import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import { TranslateService } from '@ngx-translate/core';

describe('I18nService', () => {
  let service: I18nService;
  let translateMock: { setDefaultLang: any; use: any; currentLang: string };

  beforeEach(() => {
    translateMock = {
      setDefaultLang: vi.fn(),
      use: vi.fn().mockReturnValue(undefined),
      currentLang: 'es',
    };

    TestBed.configureTestingModule({
      providers: [I18nService, { provide: TranslateService, useValue: translateMock }],
    });

    localStorage.clear();
    service = TestBed.inject(I18nService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default language to es on construction', () => {
    expect(translateMock.setDefaultLang).toHaveBeenCalledWith('es');
  });

  it('should use saved lang from localStorage on construction', () => {
    localStorage.setItem('lang', 'en');
    service = new I18nService(translateMock as unknown as TranslateService);
    expect(translateMock.use).toHaveBeenCalledWith('en');
  });

  it('should use es by default when no lang saved', () => {
    expect(translateMock.use).toHaveBeenCalledWith('es');
  });

  describe('changeLang', () => {
    it('should update localStorage with the new language', () => {
      service.changeLang('en');
      expect(localStorage.getItem('lang')).toBe('en');
    });

    it('should call translate.use with the new language', () => {
      service.changeLang('fr');
      expect(translateMock.use).toHaveBeenCalledWith('fr');
    });
  });

  describe('getCurrentLang', () => {
    it('should return current language from translate service', () => {
      translateMock.currentLang = 'en';
      expect(service.getCurrentLang()).toBe('en');
    });

    it('should return default es when currentLang is empty', () => {
      translateMock.currentLang = '';
      expect(service.getCurrentLang()).toBe('es');
    });
  });
});
