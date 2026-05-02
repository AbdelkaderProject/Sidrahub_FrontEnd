import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';
import { PublicCatalogService, ServiceCatalogItem } from '../../../services/public-catalog.service';

interface ServiceCategoryCard {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  count: number;
}

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

  trackByCategoryId(_: number, category: ServiceCategoryCard): number {
    return category.id;
  }

  buildCategoryCards(services: ServiceCatalogItem[]): ServiceCategoryCard[] {
    const grouped = new Map<number, ServiceCategoryCard>();

    for (const service of services) {
      const category = service.category;
      if (!category) {
        continue;
      }

      const current = grouped.get(category.id);
      if (current) {
        current.count += 1;
        continue;
      }

      grouped.set(category.id, {
        id: category.id,
        name: this.getCategoryName(service),
        description: this.getServiceDescription(service),
        icon: this.getServiceIcon(service),
        count: 1
      });
    }

    return [...grouped.values()];
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

  getCategoryLink(_categoryId: number): string {
    return this.locale.route('/services');
  }

  hasIconError(src: string | null): boolean {
    return src ? this.imageErrors.has(src) : true;
  }

  onIconError(src: string | null): void {
    if (src) {
      this.imageErrors.add(src);
    }
  }
}
