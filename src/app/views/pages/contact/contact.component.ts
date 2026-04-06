import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  readonly contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }

    this.contactForm.reset();
  }

  hasError(controlName: 'name' | 'email' | 'phone' | 'subject' | 'message'): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
