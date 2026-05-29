import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthRepository } from '../../../core/repositories/auth.repository';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-phone-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './phone-input.component.html'
})
export class PhoneInputComponent {
    private fb = inject(FormBuilder);
    private authRepository = inject(AuthRepository);
    private authService = inject(AuthService);
    private router = inject(Router);

    phoneForm: FormGroup;
    loading = signal(false);
    errorMessage = signal('');

    constructor() {
        this.phoneForm = this.fb.group({
            phone: ['', [
                Validators.required,
                Validators.pattern(/^[6-9]\d{9}$/),
                Validators.minLength(10),
                Validators.maxLength(10)
            ]]
        });
    }

    onSubmit(): void {
        if (this.phoneForm.invalid) return;

        this.loading.set(true);
        this.errorMessage.set('');

        const phone = this.phoneForm.value.phone;

        this.authRepository.sendOtp({ phone }).subscribe({
            next: (response) => {
                this.loading.set(false);
                // Navigate to OTP verification page with phone number
                this.router.navigate(['/auth/verify-otp'], {
                    state: { phone, maskedPhone: response.maskedPhone }
                });
            },
            error: (error) => {
                this.loading.set(false);
                this.errorMessage.set(error.message || 'Failed to send OTP. Please try again.');
            }
        });
    }
}
