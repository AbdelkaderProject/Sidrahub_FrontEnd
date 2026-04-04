import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.token) {
          this.successMessage = 'Login successful, redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }, 300);
        } else {
          this.errorMessage = 'Login failed';
        }

        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'Unexpected error';
        this.isLoading = false;
      }
    });
  }

  clearForm(): void {
    this.credentials = {
      email: '',
      password: '',
      rememberMe: false
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
