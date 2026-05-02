import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { PublicCatalogService, TeamMemberDto } from '../../../services/public-catalog.service';
import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-team',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTeamComponent {
  readonly locale = inject(LandingLocaleService);
  private readonly publicCatalogService = inject(PublicCatalogService);
  readonly teamMembers = toSignal(this.publicCatalogService.teamMembers$, { initialValue: [] as TeamMemberDto[] });
  readonly displayedMembers = computed(() => this.teamMembers().slice(0, 4));

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

  getAllTeamLink(): string {
    return this.locale.route('/team');
  }
}
