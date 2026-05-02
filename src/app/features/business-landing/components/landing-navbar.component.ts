import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { LandingLocaleService } from '../landing-locale.service';
import { PublicCatalogService, ServiceCatalogItem, ServiceCategoryDto } from '../../../services/public-catalog.service';

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
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly publicCatalogService = inject(PublicCatalogService);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  readonly languages: Language[] = [
    { code: 'ar', label: 'العربية', flagUrl: 'https://flagcdn.com/w40/sa.png', dir: 'rtl' },
    { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png', dir: 'ltr' }
  ];
  readonly currentLang = computed(
    () => this.languages.find((lang) => lang.code === this.locale.locale()) ?? this.languages[0]
  );
  readonly isLangDropdownOpen = signal(false);
  readonly isProfileDropdownOpen = signal(false);
  readonly isServicesDropdownOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);
  readonly serviceCategories = signal<Array<{ id: number; nameAr: string; nameEn: string; services: ServiceCatalogItem[] }>>([]);
  readonly activeMega = signal<number | null>(null);

  constructor() {
    combineLatest([this.publicCatalogService.categories$, this.publicCatalogService.catalogItems$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([categories, items]) => {
        const grouped = this.buildServiceCategories(categories, items);
        this.serviceCategories.set(grouped);

        if (!grouped.length) {
          this.activeMega.set(null);
          return;
        }

        const activeCategoryId = this.activeMega();
        if (activeCategoryId === null || !grouped.some((category) => category.id === activeCategoryId)) {
          this.activeMega.set(grouped[0].id);
        }
      });
  }

  setMega(id: number): void {
    this.activeMega.set(id);
  }

  onMouseEnterDropdown(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    if (this.activeMega() === null && this.serviceCategories().length) {
      this.activeMega.set(this.serviceCategories()[0].id);
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

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  currentUserName(): string {
    return this.authService.userName() || 'Profile';
  }

  currentUserInitial(): string {
    return this.currentUserName().trim().charAt(0).toUpperCase() || 'P';
  }

  goToProfile(event?: MouseEvent): void {
    event?.preventDefault();
    this.isProfileDropdownOpen.set(false);
    this.router.navigateByUrl(this.authService.getPostLoginRoute());
    this.closeMobileMenu();
  }

  logout(event?: MouseEvent): void {
    event?.preventDefault();
    this.isProfileDropdownOpen.set(false);
    this.closeMobileMenu();
    this.authService.logout();
  }

  toggleProfileDropdown(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.isProfileDropdownOpen.update((value) => !value);
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

  getCategoryLabel(category: { nameAr: string; nameEn: string }): string {
    return this.locale.locale() === 'ar' ? category.nameAr : category.nameEn;
  }

  getCategoryLink(categoryId: number): string {
    return `${this.locale.route('/services')}?category=${categoryId}`;
  }

  goToCategory(categoryId: number, event?: MouseEvent): void {
    event?.preventDefault();
    this.router.navigateByUrl(this.getCategoryLink(categoryId));
    this.closeMobileMenu();
    this.isServicesDropdownOpen.set(false);
  }

  getServiceLabel(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
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

  private buildServiceCategories(
    categories: ServiceCategoryDto[],
    items: ServiceCatalogItem[]
  ): Array<{ id: number; nameAr: string; nameEn: string; services: ServiceCatalogItem[] }> {
    return categories.map((category) => ({
      id: category.id,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      services: items.filter((item) => item.category?.id === category.id)
    }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.lang-switcher')) {
      this.isLangDropdownOpen.set(false);
    }
    if (!target?.closest('.profile-switcher')) {
      this.isProfileDropdownOpen.set(false);
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
