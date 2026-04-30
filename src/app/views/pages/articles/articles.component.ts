import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ArticleDto, PublicCatalogService } from '../../../services/public-catalog.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesComponent {
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly articles$ = this.publicCatalogService.articles$;

  getArticleTitle(article: ArticleDto): string {
    return article.titleAr;
  }

  getArticleSummary(article: ArticleDto): string {
    return article.shortDescriptionAr || article.descriptionAr;
  }

  getArticleImage(article: ArticleDto): string {
    return this.publicCatalogService.resolveAssetUrl(article.image) ?? 'https://picsum.photos/400/250?grayscale';
  }
}
