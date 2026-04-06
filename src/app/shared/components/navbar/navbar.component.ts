import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LandingNavbarComponent } from '../../../features/business-landing/components/landing-navbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LandingNavbarComponent],
  template: '<app-landing-navbar />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {}
