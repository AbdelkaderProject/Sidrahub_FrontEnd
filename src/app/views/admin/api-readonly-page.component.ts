import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, firstValueFrom } from 'rxjs';

import { CrudShellComponent } from '../../shared/crud-shell';
import { AdminResourceApiService } from './admin-resource-api.service';

@Component({
  selector: 'app-api-readonly-page',
  standalone: true,
  imports: [CommonModule, JsonPipe, RouterLink, CrudShellComponent],
  templateUrl: './api-readonly-page.component.html',
  styleUrls: ['./api-readonly-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiReadonlyPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminResourceApiService);

  protected readonly title = signal('');
  protected readonly subtitle = signal('');
  protected readonly icon = signal('pi pi-server');
  protected readonly loading = signal(true);
  protected readonly cards = signal<Array<{ title: string; description: string; link?: string; data?: unknown }>>([]);

  async ngOnInit(): Promise<void> {
    const pageKey = this.route.snapshot.data['pageKey'] as string;

    if (pageKey === 'auth') {
      this.title.set('Auth');
      this.subtitle.set('Authentication endpoints are available through the existing login and register flows.');
      this.icon.set('pi pi-shield');
      this.cards.set([
        { title: 'Login', description: 'Use the existing login page to call the Auth login endpoint.', link: '/pages/login' },
        { title: 'Register', description: 'Use the existing register page to call the Auth register endpoint.', link: '/pages/register' },
      ]);
      this.loading.set(false);
      return;
    }

    if (pageKey === 'setup') {
      this.title.set('Setup');
      this.subtitle.set('Read-only setup and modules data returned from the API.');
      this.icon.set('pi pi-cog');
      const setup = await firstValueFrom(this.api.get<unknown>('Setup', '/modules'));
      this.cards.set([{ title: 'Modules', description: 'Current setup payload from `/Setup/modules`.', data: setup }]);
      this.loading.set(false);
      return;
    }

    if (pageKey === 'localization') {
      this.title.set('Localization');
      this.subtitle.set('Read-only localization payload for both supported languages.');
      this.icon.set('pi pi-language');
      const [english, arabic] = await firstValueFrom(
        forkJoin([
          this.api.get<unknown>('Localization', '/en'),
          this.api.get<unknown>('Localization', '/ar'),
        ]),
      );
      this.cards.set([
        { title: 'English', description: 'Payload from `/Localization/en`.', data: english },
        { title: 'Arabic', description: 'Payload from `/Localization/ar`.', data: arabic },
      ]);
      this.loading.set(false);
    }
  }
}
