import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LandingLocaleService } from '../../../features/business-landing/landing-locale.service';
import { CustomerReviewDto, PublicCatalogService } from '../../../services/public-catalog.service';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly reviews$ = this.publicCatalogService.customerReviews$;

  getReviewName(review: CustomerReviewDto): string {
    return this.locale.locale() === 'ar' ? review.nameAr : review.nameEn;
  }

  getReviewOpinion(review: CustomerReviewDto): string {
    return this.locale.locale() === 'ar' ? review.opinionAr : review.opinionEn;
  }
}
