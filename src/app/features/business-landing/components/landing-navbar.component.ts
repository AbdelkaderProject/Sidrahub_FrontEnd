import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';

interface Language {
  code: 'ar' | 'en';
  label: string;
  flagUrl: string;
  dir: 'rtl' | 'ltr';
}

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingNavbarComponent implements OnDestroy {
  readonly locale = inject(LandingLocaleService);
  private readonly router = inject(Router);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  readonly languages: Language[] = [
    { code: 'ar', label: 'العربية', flagUrl: 'https://flagcdn.com/w40/sa.png', dir: 'rtl' },
    { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png', dir: 'ltr' }
  ];
  readonly currentLang = computed(
    () => this.languages.find((lang) => lang.code === this.locale.locale()) ?? this.languages[0]
  );
  readonly isLangDropdownOpen = signal(false);
  readonly isServicesDropdownOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);

  readonly activeMega = signal<
    'cat-company' | 'cat-legal' | 'cat-financial' | 'cat-solutions'
  >('cat-company');

  setMega(
    id: 'cat-company' | 'cat-legal' | 'cat-financial' | 'cat-solutions'
  ): void {
    this.activeMega.set(id);
  }

  onMouseEnterDropdown(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.isServicesDropdownOpen.set(true);
  }

  onMouseLeaveDropdown(): void {
    this.closeTimer = setTimeout(() => {
      this.isServicesDropdownOpen.set(false);
    }, 200);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.isServicesDropdownOpen.set(false);
  }

  goToAbout(event?: MouseEvent): void {
    event?.preventDefault();
    this.router.navigateByUrl('/about-us');
    this.closeMobileMenu();
  }

  goToArticles(event?: MouseEvent): void {
    event?.preventDefault();
    this.router.navigateByUrl('/blog');
    this.closeMobileMenu();
  }

  goToContact(event?: MouseEvent): void {
    event?.preventDefault();
    this.router.navigateByUrl('/contact-us');
    this.closeMobileMenu();
  }

  goToHome(event?: MouseEvent): void {
    event?.preventDefault();
    this.router.navigateByUrl('/home');
    this.closeMobileMenu();
  }

  toggleLangDropdown(event?: MouseEvent): void {
    event?.stopPropagation();
    this.isLangDropdownOpen.update((value) => !value);
  }

  selectLanguage(lang: Language): void {
    this.locale.setLocale(lang.code);
    this.isLangDropdownOpen.set(false);
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.lang-switcher')) {
      this.isLangDropdownOpen.set(false);
    }
    if (!target?.closest('.nav-container')) {
      this.isMobileMenuOpen.set(false);
    }
  }

  ngOnDestroy(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }
}
