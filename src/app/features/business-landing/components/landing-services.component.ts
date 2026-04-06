import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingServicesComponent {
  readonly locale = inject(LandingLocaleService);
}
