import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { PublicCatalogService, ServiceCatalogItem, ServicePackageDto } from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../../../features/business-landing/landing-locale.service';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly locale = inject(LandingLocaleService);

  readonly service$ = combineLatest([this.route.paramMap, this.publicCatalogService.catalogItems$]).pipe(
    map(([params, services]) => {
      const id = Number(params.get('id'));
      return services.find((service) => service.id === id) ?? null;
    })
  );

  getServiceName(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
  }

  getServiceDescription(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.descriptionAr : service.descriptionEn;
  }

  getSidebarTitle(service: ServiceCatalogItem): string | null {
    if (!service.primarySidebar) {
      return null;
    }

    return this.locale.locale() === 'ar' ? service.primarySidebar.titleAr : service.primarySidebar.titleEn;
  }

  getSidebarDescription(service: ServiceCatalogItem): string | null {
    if (!service.primarySidebar) {
      return null;
    }

    return this.locale.locale() === 'ar' ? service.primarySidebar.descriptionAr : service.primarySidebar.descriptionEn;
  }

  getHeroImage(service: ServiceCatalogItem): string {
    return (
      this.publicCatalogService.resolveAssetUrl(service.primarySidebar?.image) ??
      this.publicCatalogService.resolveAssetUrl(service.icon) ??
      'https://picsum.photos/1400/420?random=' + service.id
    );
  }

  getPackageName(packageItem: ServicePackageDto): string {
    return this.locale.locale() === 'ar' ? packageItem.nameAr : packageItem.nameEn;
  }

  getPackageIcon(packageItem: ServicePackageDto): string | null {
    return this.publicCatalogService.resolveAssetUrl(packageItem.icon);
  }
}

