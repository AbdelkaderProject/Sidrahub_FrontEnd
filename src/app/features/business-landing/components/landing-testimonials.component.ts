import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-testimonials',
  standalone: true,
  templateUrl: './landing-testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTestimonialsComponent {
  readonly locale = inject(LandingLocaleService);

  readonly videoModalOpen = signal(false);

  openVideo(): void {
    this.videoModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeVideo(): void {
    this.videoModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  onModalBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeVideo();
    }
  }
}
