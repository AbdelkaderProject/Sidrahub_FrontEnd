import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LandingFooterComponent } from '../../../features/business-landing/components/landing-footer.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LandingFooterComponent],
  template: '<app-landing-footer />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
