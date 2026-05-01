import { AsyncPipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BranchDto,
  CompanyProfileDto,
  PublicCatalogService,
  ServiceDto
} from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../landing-locale.service';
import { refreshLucideIcons } from '../lucide-refresh';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingFooterComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly profiles$ = this.publicCatalogService.companyProfiles$;
  readonly branches$ = this.publicCatalogService.branches$;
  readonly services$ = this.publicCatalogService.services$;
  readonly currentYear = new Date().getFullYear();

  constructor() {
    afterNextRender(() => {
      refreshLucideIcons();
    });
  }

  getPrimaryProfile(profiles: CompanyProfileDto[] | null): CompanyProfileDto | null {
    return profiles?.[0] ?? null;
  }

  getProfileDescription(profile: CompanyProfileDto | null): string {
    if (!profile) {
      return this.locale.t('footerAbout');
    }

    return this.locale.locale() === 'ar' ? profile.descriptionAr : profile.descriptionEn;
  }

  getProfileName(profile: CompanyProfileDto | null): string {
    if (!profile) {
      return `${this.locale.t('logoW1')} ${this.locale.t('logoW2')}`;
    }

    return this.locale.locale() === 'ar' ? profile.nameAr : profile.nameEn;
  }

  getProfileLogo(profile: CompanyProfileDto | null): string | null {
    return this.publicCatalogService.resolveAssetUrl(profile?.logo);
  }

  getServiceName(service: ServiceDto): string {
    return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
  }

  getBranchName(branch: BranchDto): string {
    return this.locale.locale() === 'ar' ? branch.nameAr : branch.nameEn;
  }

  getBranchAddress(branch: BranchDto): string {
    return this.locale.locale() === 'ar' ? branch.addressAr : branch.addressEn;
  }

  getBranchColumns(branches: BranchDto[] | null): BranchDto[][] {
    const items = branches ?? [];
    if (items.length <= 2) {
      return [items];
    }

    const midpoint = Math.ceil(items.length / 2);
    return [items.slice(0, midpoint), items.slice(midpoint)];
  }

  normalizeWhatsApp(phone: string | null | undefined): string | null {
    if (!phone) {
      return null;
    }

    const normalized = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
    return normalized || null;
  }
}
