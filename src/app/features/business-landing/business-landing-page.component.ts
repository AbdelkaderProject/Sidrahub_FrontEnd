import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LandingHeroComponent } from './components/landing-hero.component';
import { LandingServicesComponent } from './components/landing-services.component';
import { LandingMarqueeComponent } from './components/landing-marquee.component';
import { LandingStatsComponent } from './components/landing-stats.component';
import { LandingTestimonialsComponent } from './components/landing-testimonials.component';
import { LandingTeamComponent } from './components/landing-team.component';
import { LandingPartnersComponent } from './components/landing-partners.component';

@Component({
  selector: 'app-business-landing-page',
  standalone: true,
  imports: [
    LandingHeroComponent,
    LandingServicesComponent,
    LandingMarqueeComponent,
    LandingStatsComponent,
    LandingTestimonialsComponent,
    LandingTeamComponent,
    LandingPartnersComponent
  ],
  templateUrl: './business-landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessLandingPageComponent {}
