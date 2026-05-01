import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  OnDestroy,
  signal,
  viewChild,
  type WritableSignal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { CompanyProfileDto, PublicCatalogService } from '../../../services/public-catalog.service';
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
  private readonly publicCatalogService = inject(PublicCatalogService);

  readonly sectionEl = viewChild<ElementRef<HTMLElement>>('statsSection');
  readonly companyProfile = toSignal<CompanyProfileDto | null>(
    this.publicCatalogService.companyProfiles$.pipe(map((profiles) => profiles[0] ?? null)),
    { initialValue: null }
  );

  readonly n28 = signal(0);
  readonly n750 = signal(0);
  readonly n1300 = signal(0);
  readonly n60 = signal(0);
  private readonly hasIntersected = signal(false);

  private observer: IntersectionObserver | null = null;
  private hasRun = false;

  constructor() {
    effect(() => {
      const profile = this.companyProfile();
      if (!this.hasIntersected() || this.hasRun || !profile) {
        return;
      }

      this.hasRun = true;
      this.runCounters(profile);
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => refreshLucideIcons());

    const el = this.sectionEl()?.nativeElement;
    if (!el) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        this.hasIntersected.set(true);
        queueMicrotask(() => refreshLucideIcons());
      },
      { threshold: 0.5 }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private runCounters(profile: CompanyProfileDto): void {
    this.animateTo(this.n28, profile.yearExperienceNo, 2000);
    this.animateTo(this.n750, profile.successStoryNo, 2000);
    this.animateTo(this.n1300, profile.happyCustomerNo, 2000);
    this.animateTo(this.n60, profile.teamMembersNo, 2000);
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
