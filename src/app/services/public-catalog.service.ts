import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { combineLatest, map, shareReplay } from 'rxjs';

import { environment } from '../environments/environment';

export interface ServiceCategoryDto {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface ServiceDto {
  id: number;
  serviceCategoryId: number;
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string | null;
}

export interface SidebarDto {
  id: number;
  serviceId: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string | null;
}

export interface ServicePackageDto {
  id: number;
  serviceId: number;
  nameAr: string;
  nameEn: string;
  icon: string | null;
  costAmount: number;
}

export interface CompanyProfileDto {
  id: number;
  nameAr: string;
  nameEn: string;
  logo: string | null;
  descriptionAr: string;
  descriptionEn: string;
  insgramLinkStr: string | null;
  facebookLinkStr: string | null;
  twitterLinkStr: string | null;
  linkdInLinkStr: string | null;
  whatsApp: string | null;
  yearExperienceNo: number;
  successStoryNo: number;
  happyCustomerNo: number;
  teamMembersNo: number;
}

export interface BranchDto {
  id: number;
  companyProfileId: number;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  phoneNumber: string;
}

export interface CustomerReviewDto {
  id: number;
  nameAr: string;
  nameEn: string;
  opinionAr: string;
  opinionEn: string;
  urlStr: string | null;
}

export interface PartnerDto {
  id: number;
  companyProfileId: number;
  nameEn: string;
  nameAr: string;
  logo: string | null;
}

export interface TeamMemberDto {
  id: number;
  companyProfileId: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  insgramLinkStr: string | null;
  facebookLinkStr: string | null;
  twitterLinkStr: string | null;
  linkdInLinkStr: string | null;
  whatsApp: string | null;
}

export interface ArticleDto {
  id: number;
  titleAr: string;
  titleEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string | null;
}

export interface ServiceCatalogItem extends ServiceDto {
  category: ServiceCategoryDto | null;
  sidebars: SidebarDto[];
  primarySidebar: SidebarDto | null;
  packages: ServicePackageDto[];
}

@Injectable({ providedIn: 'root' })
export class PublicCatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiUrl.replace(/\/api\/?$/, '');

  private readonly categoriesRequest$ = this.http
    .get<ServiceCategoryDto[]>(`${environment.apiUrl}/ServiceCategories`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly servicesRequest$ = this.http
    .get<ServiceDto[]>(`${environment.apiUrl}/Services`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly sidebarsRequest$ = this.http
    .get<SidebarDto[]>(`${environment.apiUrl}/Sidebars`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly servicePackagesRequest$ = this.http
    .get<ServicePackageDto[]>(`${environment.apiUrl}/ServicePackages`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly companyProfilesRequest$ = this.http
    .get<CompanyProfileDto[]>(`${environment.apiUrl}/CompanyProfiles`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly branchesRequest$ = this.http
    .get<BranchDto[]>(`${environment.apiUrl}/Branches`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly customerReviewsRequest$ = this.http
    .get<CustomerReviewDto[]>(`${environment.apiUrl}/CustomerReviews`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly partnersRequest$ = this.http
    .get<PartnerDto[]>(`${environment.apiUrl}/Partners`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly teamMembersRequest$ = this.http
    .get<TeamMemberDto[]>(`${environment.apiUrl}/TeamMembers`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly articlesRequest$ = this.http
    .get<ArticleDto[]>(`${environment.apiUrl}/Articles`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly categories$ = this.categoriesRequest$;
  readonly services$ = this.servicesRequest$;
  readonly sidebars$ = this.sidebarsRequest$;
  readonly servicePackages$ = this.servicePackagesRequest$;
  readonly companyProfiles$ = this.companyProfilesRequest$;
  readonly branches$ = this.branchesRequest$;
  readonly customerReviews$ = this.customerReviewsRequest$;
  readonly partners$ = this.partnersRequest$;
  readonly teamMembers$ = this.teamMembersRequest$;
  readonly articles$ = this.articlesRequest$;

  readonly catalogItems$ = combineLatest([
    this.categoriesRequest$,
    this.servicesRequest$,
    this.sidebarsRequest$,
    this.servicePackagesRequest$
  ]).pipe(
    map(([categories, services, sidebars, packages]) =>
      services.map((service) => {
        const serviceSidebars = sidebars.filter((sidebar) => sidebar.serviceId === service.id);
        const servicePackages = packages.filter((pkg) => pkg.serviceId === service.id);
        return {
          ...service,
          category: categories.find((category) => category.id === service.serviceCategoryId) ?? null,
          sidebars: serviceSidebars,
          primarySidebar: serviceSidebars[0] ?? null,
          packages: servicePackages
        } satisfies ServiceCatalogItem;
      })
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  resolveAssetUrl(path: string | null | undefined): string | null {
    if (!path) {
      return null;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiBaseUrl}${normalizedPath}`;
  }
}
