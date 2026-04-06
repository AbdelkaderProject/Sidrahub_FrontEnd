import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
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
  ]
})
export class RegisterComponent implements OnInit {
  form = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.authService.getPostLoginRoute(), { replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.fullName || !this.form.email || !this.form.phoneNumber || !this.form.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Password and confirm password do not match.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      fullName: this.form.fullName,
      email: this.form.email,
      phoneNumber: this.form.phoneNumber,
      password: this.form.password,
      rememberMe: this.form.rememberMe
    }).subscribe({
      next: (response) => {
        if (response.token) {
          this.successMessage = 'Account created successfully, redirecting...';
          setTimeout(() => {
            this.router.navigateByUrl(this.authService.getPostLoginRoute(), { replaceUrl: true });
          }, 300);
        } else {
          this.errorMessage = 'Registration failed.';
        }

        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'Unexpected error';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
