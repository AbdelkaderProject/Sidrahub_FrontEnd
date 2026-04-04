import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>('en');
  private translations: Record<string, any> = {};
  private translationsCache: Record<string, Record<string, any>> = {};
  private loadingPromises: Partial<Record<Language, Promise<Record<string, any>>>> = {};
  private translationsLoaded = false;

  constructor() {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const browserLanguage = this.detectBrowserLanguage();
    const defaultLanguage = savedLanguage || browserLanguage || 'en';

    this.setLanguage(defaultLanguage);

    const otherLanguage: Language = defaultLanguage === 'en' ? 'ar' : 'en';
    this.loadTranslationsForLanguage(otherLanguage);
  }

  private detectBrowserLanguage(): Language {
    if (typeof navigator === 'undefined') {
      return 'en';
    }

    const browserLang = navigator.language || (navigator as any).userLanguage;
    return browserLang?.startsWith('ar') ? 'ar' : 'en';
  }

  setLanguage(lang: Language): void {
    this.currentLanguage$.next(lang);
    localStorage.setItem('language', lang);

    this.loadTranslations(lang).catch(() => {
      this.translations = {};
      this.translationsLoaded = true;
    });
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage$.value;
  }

  getLanguage$(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  private async loadTranslations(lang: Language): Promise<void> {
    if (this.translationsCache[lang]) {
      this.translations = this.translationsCache[lang];
      this.translationsLoaded = true;
      return;
    }

    this.translations = await this.loadTranslationsForLanguage(lang);
    this.translationsLoaded = true;
  }

  private async loadTranslationsForLanguage(lang: Language): Promise<Record<string, any>> {
    if (this.translationsCache[lang]) {
      return this.translationsCache[lang];
    }

    if (this.loadingPromises[lang] !== undefined) {
      return this.loadingPromises[lang];
    }

    const loadPromise = (async () => {
      try {
        const [baseTranslations, businessTranslations] = await Promise.all([
          this.fetchTranslation(`/assets/i18n/${lang}.json`),
          this.fetchTranslation(`/assets/i18n/business.${lang}.json`)
        ]);

        const merged = {
          ...baseTranslations,
          ...businessTranslations
        };

        this.translationsCache[lang] = merged;
        return merged;
      } catch {
        this.translationsCache[lang] = {};
        return {};
      } finally {
        delete this.loadingPromises[lang];
      }
    })();

    this.loadingPromises[lang] = loadPromise;
    return loadPromise;
  }

  private async fetchTranslation(path: string): Promise<Record<string, any>> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return {};
      }

      return (await response.json()) as Record<string, any>;
    } catch {
      return {};
    }
  }

  translate(key: string, params?: Record<string, any>): string {
    return this.translateForLanguage(key, this.currentLanguage$.value, params);
  }

  translateForLanguage(key: string, lang: Language, params?: Record<string, any>): string {
    const translations = this.translationsCache[lang] || this.translations || {};
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return this.interpolate(value, params);
    }

    return typeof value === 'string' ? value : key;
  }

  private interpolate(template: string, params: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  isReady(): boolean {
    return this.translationsLoaded;
  }
}
