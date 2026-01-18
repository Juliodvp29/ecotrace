import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type Language = 'en' | 'es' | 'pt';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private http = inject(HttpClient);
  private language = signal<Language>(this.detectBrowserLanguage());
  private translations = signal<Record<string, any>>({});

  currentLanguage = this.language.asReadonly();
  isLoaded = signal(false);

  constructor() {
    this.loadTranslations(this.language());
  }

  async setLanguage(lang: Language) {
    if (this.language() === lang && this.isLoaded()) return;

    await this.loadTranslations(lang);
    this.language.set(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value = this.translations();

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  private async loadTranslations(lang: Language) {
    try {
      this.isLoaded.set(false);
      const data = await firstValueFrom(
        this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`),
      );
      this.translations.set(data);
      this.isLoaded.set(true);
    } catch (error) {
      console.error(`Could not load translations for ${lang}`, error);
      this.isLoaded.set(true); // Don't block forever even on error
    }
  }

  private detectBrowserLanguage(): Language {
    const saved = localStorage.getItem('preferredLanguage') as Language;
    if (saved === 'en' || saved === 'es' || saved === 'pt') return saved;

    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') return 'es';
    if (browserLang === 'pt') return 'pt';
    return 'en';
  }
}
