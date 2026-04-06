import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LandingLocaleService } from '../landing-locale.service';
import { refreshLucideIcons } from '../lucide-refresh';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  templateUrl: './landing-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingFooterComponent {
  readonly locale = inject(LandingLocaleService);

  constructor() {
    afterNextRender(() => {
      refreshLucideIcons();
    });
  }
}
