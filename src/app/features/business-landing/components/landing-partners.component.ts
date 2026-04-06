import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LandingLocaleService } from '../landing-locale.service';

type Partner = {
  src: string;
  alt: string;
  badgeEn: string;
  badgeAr: string;
};

@Component({
  selector: 'app-landing-partners',
  standalone: true,
  templateUrl: './landing-partners.component.html',
  styleUrl: './landing-partners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPartnersComponent {
  readonly locale = inject(LandingLocaleService);
  readonly imageErrors = new Set<string>();

  readonly partners: Partner[] = [
    {
      src: 'assets/images/partners/mawani.png',
      alt: 'مواني - الهيئة العامة للموانئ',
      badgeEn: 'MAWANI',
      badgeAr: 'مواني'
    },
    {
      src: 'assets/images/partners/monshaat.png',
      alt: 'منشآت - الهيئة العامة للمنشآت الصغيرة والمتوسطة',
      badgeEn: "Monsha'at",
      badgeAr: 'منشآت'
    },
    {
      src: 'assets/images/partners/ncc.png',
      alt: 'المركز الوطني للتنافسية',
      badgeEn: 'NCC',
      badgeAr: 'المركز الوطني للتنافسية'
    },
    {
      src: 'assets/images/partners/sdaia.png',
      alt: 'الهيئة السعودية للبيانات والذكاء الاصطناعي',
      badgeEn: 'SDAIA',
      badgeAr: 'هيئة البيانات والذكاء الاصطناعي'
    },
    {
      src: 'assets/images/partners/ministry-media.png',
      alt: 'وزارة الإعلام',
      badgeEn: 'Ministry of Media',
      badgeAr: 'وزارة الإعلام'
    }
  ];

  hasImageError(src: string): boolean {
    return this.imageErrors.has(src);
  }

  onImageError(src: string): void {
    this.imageErrors.add(src);
  }
}
