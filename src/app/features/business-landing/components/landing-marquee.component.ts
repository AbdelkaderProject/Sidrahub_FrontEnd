import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-marquee',
  standalone: true,
  templateUrl: './landing-marquee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingMarqueeComponent {
  readonly locale = inject(LandingLocaleService);
}
