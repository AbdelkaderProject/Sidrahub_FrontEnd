import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor, authInterceptor])
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    MessageService,
    provideAnimationsAsync()
  ]
};
