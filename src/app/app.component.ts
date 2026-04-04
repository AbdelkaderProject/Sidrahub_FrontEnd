import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'SidraHub Business Platform';

  readonly #titleService = inject(Title);
  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    this.#titleService.setTitle(this.title);
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('sidrahub-theme');
    this.#colorModeService.eventName.set('ColorSchemeChange');
    this.#colorModeService.colorMode.set('light');

    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }
}
