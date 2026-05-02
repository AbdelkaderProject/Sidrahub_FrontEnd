import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LandingLocaleService } from '../../../features/business-landing/landing-locale.service';
import { PublicCatalogService, TeamMemberDto } from '../../../services/public-catalog.service';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly members$ = this.publicCatalogService.teamMembers$;

  getMemberName(member: TeamMemberDto): string {
    return this.locale.locale() === 'ar' ? member.nameAr : member.nameEn;
  }

  getMemberRole(member: TeamMemberDto): string {
    return this.locale.locale() === 'ar' ? member.descriptionAr : member.descriptionEn;
  }
}
