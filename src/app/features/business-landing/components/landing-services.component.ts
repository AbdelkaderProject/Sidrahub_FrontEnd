import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';
import { PublicCatalogService, ServiceCatalogItem, ServiceCategoryDto } from '../../../services/public-catalog.service';

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
  private readonly categories = toSignal(this.publicCatalogService.categories$ as any, {
    initialValue: [] as ServiceCategoryDto[]
  });
  readonly imageErrors = new Set<string>();

  trackByCategoryId(_: number, category: ServiceCategoryCard): number {
    return category.id;
  }

  buildCategoryCards(services: ServiceCatalogItem[]): ServiceCategoryCard[] {
    const categories = (this.categories() ?? []) as ServiceCategoryDto[];

    return categories.map((category: ServiceCategoryDto) => {
      const linkedServices = services.filter((service) => service.category?.id === category.id);
      const primaryService = linkedServices[0] ?? services.find((service) => service.category?.id === category.id) ?? null;

      return {
        id: category.id,
        name: this.locale.locale() === 'ar' ? category.nameAr : category.nameEn,
        description: primaryService ? this.getServiceDescription(primaryService) : '',
        icon: primaryService ? this.getServiceIcon(primaryService) : null,
        count: linkedServices.length
      };
    });
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
    return this.locale.route(`/services?category=${_categoryId}`);
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
