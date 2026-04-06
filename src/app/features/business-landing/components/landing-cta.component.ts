import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-cta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingCtaComponent {
  readonly locale = inject(LandingLocaleService);
}
