import { computed, Injectable, signal } from '@angular/core';

import { LANDING_STRINGS, LandingLocale, LandingStringKey } from './landing-strings';

@Injectable({ providedIn: 'root' })
export class LandingLocaleService {
  readonly locale = signal<LandingLocale>('ar');

  readonly dir = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));

  readonly langAttr = computed(() => (this.locale() === 'ar' ? 'ar' : 'en'));

  setLocale(next: LandingLocale): void {
    this.locale.set(next);
  }

  t(key: LandingStringKey): string {
    const loc = this.locale();
    return LANDING_STRINGS[loc][key] ?? LANDING_STRINGS.ar[key] ?? String(key);
  }
}
