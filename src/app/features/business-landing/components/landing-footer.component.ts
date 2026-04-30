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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingFooterComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly profiles$ = this.publicCatalogService.companyProfiles$;
  readonly branches$ = this.publicCatalogService.branches$;
  readonly services$ = this.publicCatalogService.services$;

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

  getServiceName(service: ServiceDto): string {
    return this.locale.locale() === 'ar' ? service.nameAr : service.nameEn;
  }

  getBranchName(branch: BranchDto): string {
    return this.locale.locale() === 'ar' ? branch.nameAr : branch.nameEn;
  }

  getBranchAddress(branch: BranchDto): string {
    return this.locale.locale() === 'ar' ? branch.addressAr : branch.addressEn;
  }

  normalizeWhatsApp(phone: string | null | undefined): string | null {
    if (!phone) {
      return null;
    }

    const normalized = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
    return normalized || null;
  }
}
