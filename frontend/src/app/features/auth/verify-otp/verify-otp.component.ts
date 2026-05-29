import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRepository } from '../../../core/repositories/auth.repository';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-verify-otp',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authRepository = inject(AuthRepository);
    private authService = inject(AuthService);
    private router = inject(Router);

    otpForm: FormGroup;
    loading = signal(false);
    errorMessage = signal('');
    phone = signal('');
    maskedPhone = signal('');
    resendTimer = signal(60);
    canResend = signal(false);

    private timerInterval?: number;

    constructor() {
        this.otpForm = this.fb.group({
            otp: ['', [
                Validators.required,
                Validators.pattern(/^\d{6}$/),
                Validators.minLength(6),
                Validators.maxLength(6)
            ]]
        });

        // Get phone from navigation state
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state || history.state;

        if (state?.phone) {
            this.phone.set(state.phone);
            this.maskedPhone.set(state.maskedPhone || '');
        } else {
            // If no phone in state, redirect back to phone input
            this.router.navigate(['/auth/login']);
        }
    }

    ngOnInit(): void {
        this.startResendTimer();
    }

    ngOnDestroy(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    startResendTimer(): void {
        this.resendTimer.set(60);
        this.canResend.set(false);

        this.timerInterval = window.setInterval(() => {
            const current = this.resendTimer();
            if (current <= 1) {
                this.canResend.set(true);
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }
            } else {
                this.resendTimer.set(current - 1);
            }
        }, 1000);
    }

    onSubmit(): void {
        if (this.otpForm.invalid) return;

        this.loading.set(true);
        this.errorMessage.set('');

        const otp = this.otpForm.value.otp;
        const phone = this.phone();

        this.authRepository.verifyOtp({ phone, otp }).subscribe({
            next: (response) => {
                this.loading.set(false);
                // Store auth data
                this.authService.setAuthData(response.user, {
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                });
                // Navigate to appropriate dashboard based on role
                this.navigateByRole(response.user.role);
            },
            error: (error) => {
                this.loading.set(false);
                this.errorMessage.set(error.message || 'Invalid OTP. Please try again.');
            }
        });
    }

    resendOtp(): void {
        if (!this.canResend()) return;

        this.loading.set(true);
        this.errorMessage.set('');

        this.authRepository.sendOtp({ phone: this.phone() }).subscribe({
            next: () => {
                this.loading.set(false);
                this.startResendTimer();
            },
            error: (error) => {
                this.loading.set(false);
                this.errorMessage.set(error.message || 'Failed to resend OTP.');
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/auth/login']);
    }

    private navigateByRole(role: string): void {
        if (role === 'APPLICANT') {
            this.router.navigate(['/app/dashboard']);
        } else {
            this.router.navigate(['/app/dashboard']);
        }
    }
}
