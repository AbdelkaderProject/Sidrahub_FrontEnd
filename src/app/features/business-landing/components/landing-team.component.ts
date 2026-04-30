import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PublicCatalogService, TeamMemberDto } from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-team',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './landing-team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTeamComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly teamMembers$ = this.publicCatalogService.teamMembers$;

  getMemberName(member: TeamMemberDto): string {
    return this.locale.locale() === 'ar' ? member.nameAr : member.nameEn;
  }

  getMemberRole(member: TeamMemberDto): string {
    return this.locale.locale() === 'ar' ? member.descriptionAr : member.descriptionEn;
  }

  getInitials(member: TeamMemberDto): string {
    const name = this.getMemberName(member).trim();
    return name ? name.charAt(0) : 'M';
  }
}
