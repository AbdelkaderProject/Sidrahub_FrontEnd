import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { LandingLocaleService } from '../../../features/business-landing/landing-locale.service';
import { PublicCatalogService, ServiceCatalogItem, ServicePackageDto } from '../../../services/public-catalog.service';

interface ServiceCategoryFilter {
  id: number;
  nameAr: string;
  nameEn: string;
  count: number;
}

interface ServicePackageViewModel {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
  bulletsAr: string[];
  bulletsEn: string[];
  ctaAr: string;
  ctaEn: string;
  icon: string | null;
  highlighted: boolean;
}

interface ServiceDetailsViewModel {
  id: number;
  name: string;
  categoryName: string;
  heroImage: string;
  overviewTitle: string;
  overviewDescription: string;
  packages: ServicePackageViewModel[];
  categoryId: number | null;
}

interface ServiceDetailsFallback {
  nameAr: string;
  nameEn: string;
  categoryNameAr: string;
  categoryNameEn: string;
  overviewTitleAr: string;
  overviewTitleEn: string;
  overviewDescriptionAr: string;
  overviewDescriptionEn: string;
  heroImage: string;
  packages: ServicePackageViewModel[];
}

const FALLBACK_SERVICE_DETAILS: Record<number, ServiceDetailsFallback> = {
  15: {
    nameAr: 'تأسيس شركات بالسعودية',
    nameEn: 'Company formation in Saudi Arabia',
    categoryNameAr: 'تأسيس شركات',
    categoryNameEn: 'Company formation',
    overviewTitleAr: 'نظرة عامة على الخدمة',
    overviewTitleEn: 'Service overview',
    overviewDescriptionAr:
      'نساعدك على تأسيس شركتك في المملكة العربية السعودية بشكل احترافي، بدءًا من تجهيز الإجراءات القانونية وحتى إصدار التراخيص وإكمال المتطلبات الأساسية بسرعة ووضوح.',
    overviewDescriptionEn:
      'We help you establish your company in Saudi Arabia professionally, from preparing the legal procedures to issuing licenses and completing the core requirements quickly and clearly.',
    heroImage: 'https://picsum.photos/1400/420?random=15',
    packages: [
      {
        id: 1501,
        nameAr: 'الباقة الأساسية',
        nameEn: 'Basic Package',
        price: 35000,
        bulletsAr: [
          'مراجعة ملف الشركة المبدئي',
          'تحديد الشكل القانوني المناسب',
          'إعداد المستندات المطلوبة للتأسيس',
          'تجهيز الطلبات الحكومية الأساسية',
          'متابعة إصدار السجل والوثائق'
        ],
        bulletsEn: [
          'Initial company file review',
          'Selecting the suitable legal structure',
          'Preparing incorporation documents',
          'Handling the core government requests',
          'Following up on registration documents'
        ],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: true
      },
      {
        id: 1502,
        nameAr: 'الباقة المتقدمة',
        nameEn: 'Advanced Package',
        price: 45000,
        bulletsAr: [
          'كل ما في الباقة الأساسية',
          'إعداد ومراجعة عقود التأسيس',
          'استكمال المتطلبات النظامية',
          'تنظيم ملف التأسيس والمتابعة',
          'دعم إضافي أثناء الإجراءات'
        ],
        bulletsEn: [
          'Everything in the Basic Package',
          'Drafting and reviewing incorporation contracts',
          'Completing regulatory requirements',
          'Organizing the incorporation file and follow-up',
          'Extra support during procedures'
        ],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      },
      {
        id: 1503,
        nameAr: 'الباقة الذهبية',
        nameEn: 'Gold Package',
        price: 50000,
        bulletsAr: [
          'كل ما في الباقة المتقدمة',
          'متابعة أوسع للإجراءات الحكومية',
          'دعم في الترتيبات القانونية',
          'تجهيزات إضافية قبل الإطلاق',
          'مراجعة نهائية قبل التسليم'
        ],
        bulletsEn: [
          'Everything in the Advanced Package',
          'Extended follow-up with government procedures',
          'Legal arrangement support',
          'Additional preparation before launch',
          'Final review before delivery'
        ],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      },
      {
        id: 1504,
        nameAr: 'الباقة الماسية',
        nameEn: 'Diamond Package',
        price: 60000,
        bulletsAr: [
          'أعلى مستوى من المتابعة',
          'حلول شاملة للتأسيس',
          'تنسيق كامل مع الجهات المختصة',
          'متابعة خاصة من البداية للنهاية',
          'دعم مكثف حتى اكتمال الإطلاق'
        ],
        bulletsEn: [
          'Highest support level',
          'End-to-end incorporation solutions',
          'Full coordination with authorities',
          'Dedicated follow-up from start to finish',
          'Intensive support until launch'
        ],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      }
    ]
  }
};

interface ServiceDetailsResult {
  service: ServiceDetailsViewModel;
  hasBackendData: boolean;
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly locale = inject(LandingLocaleService);

  readonly catalogItems$ = this.publicCatalogService.catalogItems$;
  readonly page$ = combineLatest([this.route.paramMap, this.publicCatalogService.catalogItems$]).pipe(
    map(([params, services]) => this.resolvePage(Number(params.get('id')), services))
  );

  buildCategories(services: ServiceCatalogItem[]): ServiceCategoryFilter[] {
    const grouped = new Map<number, ServiceCategoryFilter>();

    for (const service of services) {
      const category = service.category;
      if (!category) {
        continue;
      }

      const existing = grouped.get(category.id);
      if (existing) {
        existing.count += 1;
        continue;
      }

      grouped.set(category.id, {
        id: category.id,
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        count: 1
      });
    }

    return [...grouped.values()];
  }

  getCategoryName(category: ServiceCategoryFilter): string {
    return this.locale.locale() === 'ar' ? category.nameAr : category.nameEn;
  }

  getServiceName(service: ServiceCatalogItem | ServiceDetailsViewModel): string {
    if ('nameAr' in service && 'nameEn' in service) {
      return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
    }

    return this.locale.locale() === 'ar' ? service.name : service.name;
  }

  getServiceCategoryName(service: ServiceCatalogItem): string {
    if (!service.category) {
      return this.locale.locale() === 'ar' ? 'خدمة' : 'Service';
    }

    return this.locale.locale() === 'ar' ? service.category.nameAr : service.category.nameEn;
  }

  getServiceDescription(service: ServiceCatalogItem): string {
    return this.locale.locale() === 'ar' ? service.descriptionAr : service.descriptionEn;
  }

  getOverviewTitle(page: ServiceDetailsViewModel): string {
    return page.overviewTitle;
  }

  getOverviewDescription(page: ServiceDetailsViewModel): string {
    return page.overviewDescription;
  }

  getHeroImage(page: ServiceDetailsViewModel): string {
    return page.heroImage;
  }

  getPackageName(packageItem: ServicePackageDto | ServicePackageViewModel): string {
    if ('nameAr' in packageItem && 'nameEn' in packageItem && 'price' in packageItem) {
      return this.locale.locale() === 'ar' ? packageItem.nameAr : packageItem.nameEn;
    }

    return this.locale.locale() === 'ar' ? packageItem.nameAr : packageItem.nameEn;
  }

  getPackageIcon(packageItem: ServicePackageDto | ServicePackageViewModel): string | null {
    return this.publicCatalogService.resolveAssetUrl(packageItem.icon);
  }

  getPackageBullets(packageItem: ServicePackageViewModel): string[] {
    return this.locale.locale() === 'ar' ? packageItem.bulletsAr : packageItem.bulletsEn;
  }

  getPackageCta(packageItem: ServicePackageViewModel): string {
    return this.locale.locale() === 'ar' ? packageItem.ctaAr : packageItem.ctaEn;
  }

  getCategoryLink(): string {
    return this.locale.route('/services');
  }

  getServiceLink(service: ServiceCatalogItem): string {
    return this.locale.route(`/services/${service.id}`);
  }

  trackByCategoryId(_: number, category: ServiceCategoryFilter): number {
    return category.id;
  }

  trackByPackageId(_: number, packageItem: ServicePackageViewModel): number {
    return packageItem.id;
  }

  private resolvePage(id: number, services: ServiceCatalogItem[]): ServiceDetailsResult | null {
    const service = services.find((item) => item.id === id);
    if (service) {
      const backendPackages = service.packages.map<ServicePackageViewModel>((packageItem) => ({
        id: packageItem.id,
        nameAr: packageItem.nameAr,
        nameEn: packageItem.nameEn,
        price: packageItem.costAmount,
        bulletsAr: [packageItem.nameAr],
        bulletsEn: [packageItem.nameEn],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: this.publicCatalogService.resolveAssetUrl(packageItem.icon),
        highlighted: false
      }));

      return {
        service: {
          id: service.id,
          name: this.locale.locale() === 'ar' ? service.nameAr : service.nameEn,
          categoryName: this.getServiceCategoryName(service),
          heroImage: this.getHeroImageFromService(service),
          overviewTitle: this.locale.locale() === 'ar' ? 'نظرة عامة على الخدمة' : 'Service overview',
          overviewDescription: this.getServiceDescription(service),
          packages: backendPackages.length ? backendPackages : this.getFallbackDetails(service.id).packages,
          categoryId: service.category?.id ?? null
        },
        hasBackendData: true
      };
    }

    const fallback = this.getFallbackDetails(id);
    return {
      service: {
        id,
        name: this.locale.locale() === 'ar' ? fallback.nameAr : fallback.nameEn,
        categoryName: this.locale.locale() === 'ar' ? fallback.categoryNameAr : fallback.categoryNameEn,
        heroImage: fallback.heroImage,
        overviewTitle: this.locale.locale() === 'ar' ? fallback.overviewTitleAr : fallback.overviewTitleEn,
        overviewDescription: this.locale.locale() === 'ar' ? fallback.overviewDescriptionAr : fallback.overviewDescriptionEn,
        packages: fallback.packages,
        categoryId: 10
      },
      hasBackendData: false
    };
  }

  private getFallbackDetails(id: number): ServiceDetailsFallback {
    return (
      FALLBACK_SERVICE_DETAILS[id] ?? {
        nameAr: 'الخدمة',
        nameEn: 'Service',
        categoryNameAr: 'خدمة',
        categoryNameEn: 'Service',
        overviewTitleAr: 'نظرة عامة على الخدمة',
        overviewTitleEn: 'Service overview',
        overviewDescriptionAr: 'وصف مختصر للخدمة سيتم ربطه لاحقًا من الباك.',
        overviewDescriptionEn: 'A short service description that will be bound from the backend later.',
        heroImage: 'https://picsum.photos/1400/420?random=' + id,
        packages: this.getGenericFallbackPackages(id)
      }
    );
  }

  private getGenericFallbackPackages(id: number): ServicePackageViewModel[] {
    return [
      {
        id: id * 100 + 1,
        nameAr: 'الباقة الأساسية',
        nameEn: 'Basic Package',
        price: 35000,
        bulletsAr: ['وصف الباقة سيأتي من الباك لاحقًا'],
        bulletsEn: ['Package details will come from the backend later'],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      },
      {
        id: id * 100 + 2,
        nameAr: 'الباقة المتقدمة',
        nameEn: 'Advanced Package',
        price: 45000,
        bulletsAr: ['وصف الباقة سيأتي من الباك لاحقًا'],
        bulletsEn: ['Package details will come from the backend later'],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      },
      {
        id: id * 100 + 3,
        nameAr: 'الباقة الذهبية',
        nameEn: 'Gold Package',
        price: 50000,
        bulletsAr: ['وصف الباقة سيأتي من الباك لاحقًا'],
        bulletsEn: ['Package details will come from the backend later'],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      },
      {
        id: id * 100 + 4,
        nameAr: 'الباقة الماسية',
        nameEn: 'Diamond Package',
        price: 60000,
        bulletsAr: ['وصف الباقة سيأتي من الباك لاحقًا'],
        bulletsEn: ['Package details will come from the backend later'],
        ctaAr: 'الحصول على الباقة',
        ctaEn: 'Get Package',
        icon: null,
        highlighted: false
      }
    ];
  }

  private getHeroImageFromService(service: ServiceCatalogItem): string {
    return (
      this.publicCatalogService.resolveAssetUrl(service.primarySidebar?.image) ??
      this.publicCatalogService.resolveAssetUrl(service.icon) ??
      'https://picsum.photos/1400/420?random=' + service.id
    );
  }
}
