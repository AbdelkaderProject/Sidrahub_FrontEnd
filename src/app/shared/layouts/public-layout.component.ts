import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  untracked,
  ViewEncapsulation
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { LandingLocaleService } from '../../features/business-landing/landing-locale.service';
import { LandingCtaComponent } from '../../features/business-landing/components/landing-cta.component';
import { refreshLucideIcons } from '../../features/business-landing/lucide-refresh';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, NavbarComponent, LandingCtaComponent, FooterComponent],
  template: `
    <div class="business-landing" [attr.dir]="locale.dir()" [attr.lang]="locale.langAttr()">
      <app-navbar />
      <router-outlet />
      <app-landing-cta />
      <app-footer />
    </div>
  `,
  styleUrl: '../../features/business-landing/business-landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {
  readonly locale = inject(LandingLocaleService);

  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      refreshLucideIcons();
    });

    effect(() => {
      const loc = this.locale.locale();
      this.title.setTitle(this.locale.t('pageTitle'));
      document.documentElement.lang = loc === 'ar' ? 'ar' : 'en';
      document.documentElement.dir = loc === 'ar' ? 'rtl' : 'ltr';
      untracked(() => {
        queueMicrotask(() => refreshLucideIcons());
      });
    });

    this.destroyRef.onDestroy(() => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    });
  }
}
