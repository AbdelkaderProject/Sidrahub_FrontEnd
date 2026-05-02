import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { PublicCatalogService, ServiceCatalogItem } from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../landing-locale.service';

interface HeroSlideView {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface HeroCopy {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingHeroComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);

  readonly currentSlide = signal(0);
  readonly heroPaused = signal(false);
  private readonly resetTimer = signal(0);
  private readonly serviceRecords = toSignal(this.publicCatalogService.catalogItems$ as any, {
    initialValue: [] as ServiceCatalogItem[]
  });
  private readonly heroCopies: HeroCopy[] = [
    {
      titleAr: 'منصة المتميز لخدمات الأعمال',
      titleEn: 'SidraHub Business Platform',
      descriptionAr: 'كل ما تحتاجه في مكان واحد بوابتك إلى التميز لتأسيس شركتك وتطوير أعمالك التجارية وتقديم الدعم الكامل لها.',
      descriptionEn:
        'Everything you need in one place. Your gateway to excellence for establishing your company, growing your business, and getting full support.'
    },
    {
      titleAr: 'منصة المتميز لخدمات الأعمال',
      titleEn: 'SidraHub Business Platform',
      descriptionAr:
        'اجمع كل خدماتك القانونية والمالية وخدمات العلاقات العامة في مكان واحد ووفر تكاليف التوظيف.',
      descriptionEn:
        'Bring your legal, financial, and public relations services together in one place and save hiring costs.'
    }
  ];

  readonly slides = computed(() => {
    const services = (this.serviceRecords() ?? []) as ServiceCatalogItem[];
    const slides = services
      .slice()
      .sort((left: ServiceCatalogItem, right: ServiceCatalogItem) => left.id - right.id)
      .map((service: ServiceCatalogItem, index: number) => this.mapService(service, index));

    if (slides.length > 0) {
      return slides;
    }

    return this.buildFallbackSlides();
  });

  readonly slideCount = computed(() => Math.max(this.slides().length, 1));

  constructor() {
    effect((onCleanup) => {
      const count = this.slideCount();
      this.heroPaused();
      this.resetTimer();

      if (this.currentSlide() >= count) {
        this.currentSlide.set(0);
      }

      if (this.heroPaused() || count <= 1) {
        return;
      }

      const id = window.setInterval(() => {
        this.currentSlide.update((index) => (index + 1) % count);
      }, 5000);

      onCleanup(() => clearInterval(id));
    });
  }

  nextSlide(): void {
    const count = this.slideCount();
    this.currentSlide.update((index) => (index + 1) % count);
    this.resetTimer.update((value) => value + 1);
  }

  prevSlide(): void {
    const count = this.slideCount();
    this.currentSlide.update((index) => (index - 1 + count) % count);
    this.resetTimer.update((value) => value + 1);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.resetTimer.update((value) => value + 1);
  }

  setHeroPaused(paused: boolean): void {
    this.heroPaused.set(paused);
  }

  private mapService(service: ServiceCatalogItem, index: number): HeroSlideView {
    const copy = this.pickHeroCopy(index);

    return {
      id: service.id,
      title: copy.title,
      description: copy.description,
      imageUrl: this.publicCatalogService.resolveAssetUrl(service.icon) ?? 'https://picsum.photos/800/600?random=' + service.id
    };
  }

  private pickHeroCopy(index: number): { title: string; description: string } {
    const copy = this.heroCopies[index] ?? null;

    if (copy) {
      return this.locale.locale() === 'ar'
        ? { title: copy.titleAr, description: copy.descriptionAr }
        : { title: copy.titleEn, description: copy.descriptionEn };
    }

    return {
      title: this.locale.locale() === 'ar' ? 'منصة المتميز لخدمات الأعمال' : 'SidraHub Business Platform',
      description:
        this.locale.locale() === 'ar'
          ? 'كل ما تحتاجه في مكان واحد بوابتك إلى التميز لتأسيس شركتك وتطوير أعمالك التجارية وتقديم الدعم الكامل لها.'
          : 'Everything you need in one place. Your gateway to excellence for establishing your company, growing your business, and getting full support.'
    };
  }

  private buildFallbackSlides(): HeroSlideView[] {
    return [
      {
        id: 1,
        title: this.locale.t('heroTitle'),
        description: this.locale.t('heroP1'),
        imageUrl: 'https://picsum.photos/800/600?random=1'
      },
      {
        id: 2,
        title: this.locale.t('heroTitle'),
        description: this.locale.t('heroP2'),
        imageUrl: 'https://picsum.photos/800/600?random=2'
      }
    ];
  }
}
