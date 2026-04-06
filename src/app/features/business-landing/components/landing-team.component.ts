import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';

import { LandingLocaleService } from '../landing-locale.service';

type TeamMember = {
  image: string;
  name: string;
  role: string;
};

@Component({
  selector: 'app-landing-team',
  standalone: true,
  templateUrl: './landing-team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTeamComponent implements OnInit, OnDestroy {
  readonly locale = inject(LandingLocaleService);
  private rotationTimer: ReturnType<typeof setInterval> | null = null;

  readonly teamMembers = computed<TeamMember[]>(() => [
    { image: 'https://picsum.photos/300/400?random=21', name: this.locale.t('t1Name'), role: this.locale.t('t1Role') },
    { image: 'https://picsum.photos/300/400?random=22', name: this.locale.t('t2Name'), role: this.locale.t('t2Role') },
    { image: 'https://picsum.photos/300/400?random=23', name: this.locale.t('t3Name'), role: this.locale.t('t3Role') },
    { image: 'https://picsum.photos/300/400?random=24', name: this.locale.t('t4Name'), role: this.locale.t('t4Role') },
    { image: 'https://picsum.photos/300/400?random=25', name: this.locale.t('t5Name'), role: this.locale.t('t5Role') },
    { image: 'https://picsum.photos/300/400?random=26', name: this.locale.t('t6Name'), role: this.locale.t('t6Role') },
    { image: 'https://picsum.photos/300/400?random=27', name: this.locale.t('t7Name'), role: this.locale.t('t7Role') },
    { image: 'https://picsum.photos/300/400?random=28', name: this.locale.t('t8Name'), role: this.locale.t('t8Role') }
  ]);

  readonly currentIndex = signal(0);
  readonly visibleMembers = computed(() =>
    Array.from(
      { length: 4 },
      (_, offset) => this.teamMembers()[(this.currentIndex() + offset) % this.teamMembers().length]
    )
  );

  private get teamMembersCount(): number {
    return this.teamMembers().length;
  }

  ngOnInit(): void {
    this.rotationTimer = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.teamMembersCount);
    }, 3200);
  }

  ngOnDestroy(): void {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
  }
}
