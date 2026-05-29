import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    AuthResponse,
    OfficerLoginRequest,
} from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class AuthRepository {
    private http = inject(HttpClient);

    sendOtp(request: SendOtpRequest): Observable<SendOtpResponse> {
        return this.http.post<ApiResponse<SendOtpResponse>>(
            API_ENDPOINTS.AUTH.SEND_OTP,
            request
        ).pipe(map(res => res.data!));
    }

    verifyOtp(request: VerifyOtpRequest): Observable<AuthResponse> {
        return this.http.post<ApiResponse<AuthResponse>>(
            API_ENDPOINTS.AUTH.VERIFY_OTP,
            request
        ).pipe(map(res => res.data!));
    }

    officerLogin(request: OfficerLoginRequest): Observable<AuthResponse> {
        return this.http.post<ApiResponse<AuthResponse>>(
            API_ENDPOINTS.AUTH.OFFICER_LOGIN,
            request
        ).pipe(map(res => res.data!));
    }

    refreshToken(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }> {
        return this.http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            API_ENDPOINTS.AUTH.REFRESH,
            { refreshToken }
        ).pipe(map(res => res.data!));
    }

    logout(refreshToken: string): Observable<void> {
        return this.http.post<ApiResponse<void>>(
            API_ENDPOINTS.AUTH.LOGOUT,
            { refreshToken }
        ).pipe(map(() => undefined));
    }
}
