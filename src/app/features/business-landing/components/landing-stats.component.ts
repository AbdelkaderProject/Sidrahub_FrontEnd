import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
  type WritableSignal
} from '@angular/core';

import { LandingLocaleService } from '../landing-locale.service';
import { refreshLucideIcons } from '../lucide-refresh';

@Component({
  selector: 'app-landing-stats',
  standalone: true,
  templateUrl: './landing-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingStatsComponent implements AfterViewInit, OnDestroy {
  readonly locale = inject(LandingLocaleService);

  readonly sectionEl = viewChild<ElementRef<HTMLElement>>('statsSection');

  readonly n28 = signal(0);
  readonly n750 = signal(0);
  readonly n1300 = signal(0);
  readonly n60 = signal(0);

  private observer: IntersectionObserver | null = null;
  private hasRun = false;

  ngAfterViewInit(): void {
    queueMicrotask(() => refreshLucideIcons());

    const el = this.sectionEl()?.nativeElement;
    if (!el) {
      return;
    }
    this.observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting || this.hasRun) {
          return;
        }
        this.hasRun = true;
        queueMicrotask(() => refreshLucideIcons());
        this.runCounters();
      },
      { threshold: 0.5 }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private runCounters(): void {
    this.animateTo(this.n28, 28, 2000);
    this.animateTo(this.n750, 750, 2000);
    this.animateTo(this.n1300, 1300, 2000);
    this.animateTo(this.n60, 60, 2000);
  }

  private animateTo(
    targetSig: WritableSignal<number>,
    target: number,
    durationMs: number
  ): void {
    const start = performance.now();
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - p) * (1 - p);
      const v = Math.ceil(target * eased);
      targetSig.set(v);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        targetSig.set(target);
      }
    };
    requestAnimationFrame(tick);
  }
}
