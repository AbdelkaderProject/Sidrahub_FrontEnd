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

  readonly slides = computed(() => {
    const services = (this.serviceRecords() ?? []) as ServiceCatalogItem[];
    const slides = services
      .slice()
      .sort((left: ServiceCatalogItem, right: ServiceCatalogItem) => left.id - right.id)
      .map((service) => this.mapService(service));

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

  private mapService(service: ServiceCatalogItem): HeroSlideView {
    const sidebar = service.primarySidebar ?? service.sidebars[0] ?? null;

    return {
      id: service.id,
      title: this.locale.locale() === 'ar' ? sidebar?.titleAr ?? service.nameAr : sidebar?.titleEn ?? service.nameEn,
      description:
        this.locale.locale() === 'ar'
          ? sidebar?.descriptionAr ?? service.shortDescriptionAr
          : sidebar?.descriptionEn ?? service.shortDescriptionEn,
      imageUrl:
        this.publicCatalogService.resolveAssetUrl(sidebar?.image) ??
        this.publicCatalogService.resolveAssetUrl(service.icon) ??
        'https://picsum.photos/800/600?random=' + service.id
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
