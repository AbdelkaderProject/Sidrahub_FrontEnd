import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PartnerDto, PublicCatalogService } from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-partners',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './landing-partners.component.html',
  styleUrl: './landing-partners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPartnersComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly partners$ = this.publicCatalogService.partners$;
  readonly imageErrors = new Set<string>();

  hasImageError(src: string | null): boolean {
    return src ? this.imageErrors.has(src) : true;
  }

  onImageError(src: string | null): void {
    if (src) {
      this.imageErrors.add(src);
    }
  }

  getPartnerName(partner: PartnerDto): string {
    return this.locale.locale() === 'ar' ? partner.nameAr : partner.nameEn;
  }

  getPartnerLogo(partner: PartnerDto): string | null {
    return this.publicCatalogService.resolveAssetUrl(partner.logo);
  }
}
