import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { LandingLocaleService } from '../landing-locale.service';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingHeroComponent {
  readonly locale = inject(LandingLocaleService);

  readonly currentSlide = signal(0);
  readonly heroPaused = signal(false);
  private readonly resetTimer = signal(0);

  private readonly slideCount = 2;

  constructor() {
    effect(onCleanup => {
      this.heroPaused();
      this.resetTimer();
      if (this.heroPaused()) {
        return;
      }
      const id = window.setInterval(() => {
        this.currentSlide.update(i => (i + 1) % this.slideCount);
      }, 5000);
      onCleanup(() => clearInterval(id));
    });
  }

  nextSlide(): void {
    this.currentSlide.update(i => (i + 1) % this.slideCount);
    this.resetTimer.update(v => v + 1);
  }

  prevSlide(): void {
    this.currentSlide.update(
      i => (i - 1 + this.slideCount) % this.slideCount
    );
    this.resetTimer.update(v => v + 1);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.resetTimer.update(v => v + 1);
  }

  setHeroPaused(paused: boolean): void {
    this.heroPaused.set(paused);
  }
}
