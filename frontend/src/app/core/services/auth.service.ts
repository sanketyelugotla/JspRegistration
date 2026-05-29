import { Injectable, signal, computed } from '@angular/core';
import { User, AuthTokens } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'jsp_access_token';
    private readonly REFRESH_TOKEN_KEY = 'jsp_refresh_token';
    private readonly USER_KEY = 'jsp_user';

    // Check if we're in a browser environment
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    private userSignal = signal<User | null>(this.getStoredUser());
    private tokenSignal = signal<string | null>(this.getAccessToken());

    // Public readonly signals
    readonly user = this.userSignal.asReadonly();
    readonly isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());
    readonly isApplicant = computed(() => this.userSignal()?.role === 'APPLICANT');
    readonly isOfficer = computed(() => {
        const role = this.userSignal()?.role;
        return role === 'MANDAL_OFFICER' || role === 'DISTRICT_OFFICER' || role === 'STATE_OFFICER';
    });
    readonly isSuperAdmin = computed(() => this.userSignal()?.role === 'SUPER_ADMIN');

    setAuthData(user: User, tokens: AuthTokens): void {
        this.userSignal.set(user);
        this.tokenSignal.set(tokens.accessToken);
        if (this.isBrowser()) {
            localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
            localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    getAccessToken(): string | null {
        return this.isBrowser() ? localStorage.getItem(this.TOKEN_KEY) : null;
    }

    getRefreshToken(): string | null {
        return this.isBrowser() ? localStorage.getItem(this.REFRESH_TOKEN_KEY) : null;
    }

    private getStoredUser(): User | null {
        if (!this.isBrowser()) {
            return null;
        }
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    clearAuthData(): void {
        this.userSignal.set(null);
        this.tokenSignal.set(null);
        if (this.isBrowser()) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.REFRESH_TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        }
    }

    updateUser(user: User): void {
        this.userSignal.set(user);
        if (this.isBrowser()) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }
}
