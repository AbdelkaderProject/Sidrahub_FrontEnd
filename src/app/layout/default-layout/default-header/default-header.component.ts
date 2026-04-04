import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  ContainerComponent,
  DropdownComponent,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  NavItemComponent,
  NavLinkDirective,
} from '@coreui/angular';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective
  ]
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
