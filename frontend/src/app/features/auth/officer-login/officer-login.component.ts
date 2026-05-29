import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthRepository } from '../../../core/repositories/auth.repository';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-officer-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './officer-login.component.html'
})
export class OfficerLoginComponent {
    private fb = inject(FormBuilder);
    private authRepository = inject(AuthRepository);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup;
    loading = signal(false);
    errorMessage = signal('');

    constructor() {
        this.loginForm = this.fb.group({
            phone: ['', [
                Validators.required,
                Validators.pattern(/^[6-9]\d{9}$/),
                Validators.minLength(10),
                Validators.maxLength(10)
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(6)
            ]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) return;

        this.loading.set(true);
        this.errorMessage.set('');

        const { phone, password } = this.loginForm.value;

        this.authRepository.officerLogin({ phone, password }).subscribe({
            next: (response) => {
                this.loading.set(false);
                // Store auth data
                this.authService.setAuthData(response.user, {
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                });
                // Navigate to dashboard
                this.router.navigate(['/app/dashboard']);
            },
            error: (error) => {
                this.loading.set(false);
                this.errorMessage.set(error.message || 'Invalid credentials. Please try again.');
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/auth/login']);
    }
}
