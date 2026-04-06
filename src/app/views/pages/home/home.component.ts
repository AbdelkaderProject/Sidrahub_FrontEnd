import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BusinessLandingPageComponent } from '../../../features/business-landing/business-landing-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BusinessLandingPageComponent],
  template: '<app-business-landing-page />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
