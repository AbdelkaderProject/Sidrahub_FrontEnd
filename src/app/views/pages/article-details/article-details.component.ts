import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { LandingLocaleService } from '../../../features/business-landing/landing-locale.service';
import { ArticleDto, PublicCatalogService, ServiceCategoryDto } from '../../../services/public-catalog.service';

interface RelatedArticleVm {
  id: number;
  title: string;
  image: string;
}

interface ArticleDetailsVm {
  id: number;
  title: string;
  summary: string;
  description: string;
  image: string;
  categoryId: number | null;
  categoryName: string;
  relatedArticles: RelatedArticleVm[];
}

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDetailsComponent {
  private readonly publicCatalogService = inject(PublicCatalogService);
  private readonly route = inject(ActivatedRoute);
  readonly locale = inject(LandingLocaleService);
  readonly imageErrors = new Set<string>();

  readonly page$ = combineLatest([
    this.publicCatalogService.articles$,
    this.publicCatalogService.categories$,
    this.route.paramMap
  ]).pipe(
    map(([articles, categories, params]) => {
      const id = Number(params.get('id'));
      if (!Number.isFinite(id)) {
        return null;
      }

      const currentArticle = articles.find((article) => article.id === id);
      if (!currentArticle) {
        return null;
      }

      const articleCards = articles.map((article) => this.toArticleCard(article, categories));
      const currentCard = articleCards.find((article) => article.id === id) ?? this.toArticleCard(currentArticle, categories);
      const relatedArticles = this.buildRelatedArticles(articleCards, currentCard.id, currentCard.categoryId);

      return {
        ...currentCard,
        description: this.getArticleDescription(currentArticle),
        relatedArticles
      } satisfies ArticleDetailsVm;
    })
  );

  getCategoryLink(categoryId?: number | null): string {
    if (typeof categoryId !== 'number') {
      return this.locale.route('/blog');
    }

    return this.locale.route(`/blog?category=${categoryId}`);
  }

  getArticleLink(articleId: number): string {
    return this.locale.route(`/blog/${articleId}`);
  }

  hasArticleImageError(src: string | null): boolean {
    return src ? this.imageErrors.has(src) : true;
  }

  onArticleImageError(src: string | null): void {
    if (src) {
      this.imageErrors.add(src);
    }
  }

  private toArticleCard(article: ArticleDto, categories: ServiceCategoryDto[]): ArticleDetailsVm {
    const categoryId = this.resolveArticleCategoryId(article, categories);
    const category = categoryId ? categories.find((item) => item.id === categoryId) ?? null : null;

    return {
      id: article.id,
      title: this.getArticleTitle(article),
      summary: this.getArticleSummary(article),
      description: this.getArticleDescription(article),
      image: this.resolveArticleImage(article),
      categoryId,
      categoryName: category ? this.getCategoryName(category) : this.locale.locale() === 'ar' ? 'مقال' : 'Article',
      relatedArticles: []
    };
  }

  private buildRelatedArticles(articles: ArticleDetailsVm[], currentId: number, categoryId: number | null): RelatedArticleVm[] {
    const ordered = articles
      .filter((article) => article.id !== currentId)
      .sort((left, right) => {
        const leftScore = left.categoryId === categoryId ? 0 : 1;
        const rightScore = right.categoryId === categoryId ? 0 : 1;
        return leftScore - rightScore || left.id - right.id;
      })
      .slice(0, 4);

    return ordered.map((article) => ({
      id: article.id,
      title: article.title,
      image: article.image
    }));
  }

  private resolveArticleCategoryId(article: ArticleDto, categories: ServiceCategoryDto[]): number | null {
    if (typeof article.serviceCategoryId === 'number') {
      return article.serviceCategoryId;
    }

    const searchText = this.normalizeText([
      article.titleAr,
      article.titleEn,
      article.shortDescriptionAr,
      article.shortDescriptionEn,
      article.descriptionAr,
      article.descriptionEn
    ].join(' '));

    for (const category of categories) {
      const tokens = this.getCategoryTokens(category);
      if (tokens.some((token) => token && searchText.includes(token))) {
        return category.id;
      }
    }

    return null;
  }

  private getArticleTitle(article: ArticleDto): string {
    return this.locale.locale() === 'ar' ? article.titleAr : article.titleEn;
  }

  private getArticleSummary(article: ArticleDto): string {
    return this.locale.locale() === 'ar' ? article.shortDescriptionAr || article.descriptionAr : article.shortDescriptionEn || article.descriptionEn;
  }

  private getArticleDescription(article: ArticleDto): string {
    return this.locale.locale() === 'ar' ? article.descriptionAr : article.descriptionEn;
  }

  private getCategoryName(category: ServiceCategoryDto): string {
    return this.locale.locale() === 'ar' ? category.nameAr : category.nameEn;
  }

  private resolveArticleImage(article: ArticleDto): string {
    return this.publicCatalogService.resolveAssetUrl(article.image) ?? `https://picsum.photos/1400/780?random=${article.id}`;
  }

  private getCategoryTokens(category: ServiceCategoryDto): string[] {
    const normalizedAr = this.normalizeText(category.nameAr);
    const normalizedEn = this.normalizeText(category.nameEn);
    const tokens = new Set<string>([normalizedAr, normalizedEn]);

    if (normalizedAr.includes('تاسيس')) {
      ['تاسيس', 'شركة', 'شركات', 'company', 'formation'].forEach((token) => tokens.add(token));
    }

    if (normalizedAr.includes('قانون')) {
      ['قانون', 'قانوني', 'محامي', 'محاماة', 'legal'].forEach((token) => tokens.add(token));
    }

    if (normalizedAr.includes('مالي') || normalizedAr.includes('ضريبي')) {
      ['مالي', 'ضريبي', 'ضرائب', 'زكاة', 'tax', 'financial'].forEach((token) => tokens.add(token));
    }

    if (normalizedAr.includes('تعقيب') || normalizedAr.includes('اعمال')) {
      ['تعقيب', 'اعمال', 'خدمات', 'تراخيص', 'تصاريح', 'business'].forEach((token) => tokens.add(token));
    }

    return [...tokens];
  }

  private normalizeText(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '')
      .toLowerCase();
  }
}
