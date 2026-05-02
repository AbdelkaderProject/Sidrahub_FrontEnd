import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { CustomerReviewDto, PublicCatalogService } from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../landing-locale.service';
import { refreshLucideIcons } from '../lucide-refresh';

@Component({
  selector: 'app-landing-testimonials',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTestimonialsComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly reviews = toSignal(this.publicCatalogService.customerReviews$, { initialValue: [] as CustomerReviewDto[] });
  readonly displayedReviews = computed(() => this.reviews().slice(0, 4));
  readonly activeVideoUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.displayedReviews();
      queueMicrotask(() => refreshLucideIcons());
    });
  }

  getReviewName(review: CustomerReviewDto): string {
    return this.locale.locale() === 'ar' ? review.nameAr : review.nameEn;
  }

  getReviewOpinion(review: CustomerReviewDto): string {
    return this.locale.locale() === 'ar' ? review.opinionAr : review.opinionEn;
  }

  getReviewMedia(review: CustomerReviewDto): string | null {
    return this.publicCatalogService.resolveAssetUrl(review.urlStr);
  }

  openReview(review: CustomerReviewDto): void {
    const reviewMedia = this.getReviewMedia(review);
    if (!reviewMedia) {
      return;
    }

    this.activeVideoUrl.set(reviewMedia);
    document.body.style.overflow = 'hidden';
  }

  closeVideo(): void {
    this.activeVideoUrl.set(null);
    document.body.style.overflow = 'auto';
  }

  onModalBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeVideo();
    }
  }

  trackByReviewId(_: number, review: CustomerReviewDto): number {
    return review.id;
  }

  getAllReviewsLink(): string {
    return this.locale.route('/reviews');
  }
}
