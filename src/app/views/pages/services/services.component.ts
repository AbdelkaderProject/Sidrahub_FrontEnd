import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { LandingLocaleService } from '../../../features/business-landing/landing-locale.service';
import { PublicCatalogService, ServiceCatalogItem } from '../../../services/public-catalog.service';

interface ServicesCategoryFilter {
  id: number;
  nameAr: string;
  nameEn: string;
}

interface ServicesPageVm {
  categories: ServicesCategoryFilter[];
  activeCategory: ServicesCategoryFilter | null;
  services: ServiceCatalogItem[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  private readonly route = inject(ActivatedRoute);

  readonly vm$ = combineLatest([this.publicCatalogService.catalogItems$, this.route.queryParamMap]).pipe(
    map(([services, queryParams]) => {
      const categories = this.buildCategories(services);
      const selectedCategoryId = Number(queryParams.get('category'));
      const activeCategory = categories.find((category) => category.id === selectedCategoryId) ?? null;
      const filteredServices = activeCategory
        ? services.filter((service) => service.category?.id === activeCategory.id)
        : services;

      return {
        categories,
        activeCategory,
        services: filteredServices
      } satisfies ServicesPageVm;
    })
  );

  private buildCategories(services: ServiceCatalogItem[]): ServicesCategoryFilter[] {
    const grouped = new Map<number, ServicesCategoryFilter>();

    for (const service of services) {
      const category = service.category;
      if (!category || grouped.has(category.id)) {
        continue;
      }

      grouped.set(category.id, {
        id: category.id,
        nameAr: category.nameAr,
        nameEn: category.nameEn
      });
    }

    return [...grouped.values()];
  }

  getCategoryName(category: ServicesCategoryFilter): string {
    return this.locale.locale() === 'ar' ? category.nameAr : category.nameEn;
  }

  getServiceCategoryName(service: ServiceCatalogItem): string {
    if (!service.category) {
      return this.locale.locale() === 'ar' ? 'خدمة' : 'Service';
    }

    return this.locale.locale() === 'ar' ? service.category.nameAr : service.category.nameEn;
  }

  getServiceName(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
  }

  getServiceDescription(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.shortDescriptionAr : service.shortDescriptionEn;
  }

  getServiceIcon(service: ServiceCatalogItem): string | null {
    return this.publicCatalogService.resolveAssetUrl(service.icon);
  }

  getServiceLink(service: ServiceCatalogItem): string {
    return this.locale.route(`/services/${service.id}`);
  }

  getCategoryLink(categoryId?: number): string {
    if (typeof categoryId !== 'number') {
      return this.locale.route('/services');
    }

    return `${this.locale.route('/services')}?category=${categoryId}`;
  }

  trackByCategoryId(_: number, category: ServicesCategoryFilter): number {
    return category.id;
  }

  trackByServiceId(_: number, service: ServiceCatalogItem): number {
    return service.id;
  }
}
