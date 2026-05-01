import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';
import { PublicCatalogService, ServiceCatalogItem } from '../../../services/public-catalog.service';

@Component({
  selector: 'app-landing-services',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './landing-services.component.html',
  styleUrl: './landing-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingServicesComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly catalogItems$ = this.publicCatalogService.catalogItems$;
  readonly imageErrors = new Set<string>();

  trackByServiceId(_: number, service: ServiceCatalogItem): number {
    return service.id;
  }

  getServiceName(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
  }

  getCategoryName(service: ServiceCatalogItem): string {
    if (!service.category) {
      return this.locale.locale() === 'ar' ? 'خدمة' : 'Service';
    }

    return this.locale.locale() === 'ar' ? service.category.nameAr : service.category.nameEn;
  }

  getServiceDescription(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.shortDescriptionAr : service.shortDescriptionEn;
  }

  getServiceIcon(service: ServiceCatalogItem): string | null {
    return this.publicCatalogService.resolveAssetUrl(service.icon);
  }

  hasIconError(src: string | null): boolean {
    return src ? this.imageErrors.has(src) : true;
  }

  onIconError(src: string | null): void {
    if (src) {
      this.imageErrors.add(src);
    }
  }

  getSidebarTitle(service: ServiceCatalogItem): string | null {
    const sidebar = service.primarySidebar;
    if (!sidebar) {
      return null;
    }

    return this.locale.locale() === 'ar' ? sidebar.titleAr : sidebar.titleEn;
  }

  getSidebarDescription(service: ServiceCatalogItem): string | null {
    const sidebar = service.primarySidebar;
    if (!sidebar) {
      return null;
    }

    return this.locale.locale() === 'ar' ? sidebar.descriptionAr : sidebar.descriptionEn;
  }
}
