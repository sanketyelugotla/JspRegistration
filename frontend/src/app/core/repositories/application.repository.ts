import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Application,
    CreateApplicationRequest,
    UpdateApplicationRequest,
    ApplicationStatistics,
} from '../models/application.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ApplicationStatus } from '../constants/status.constants';

@Injectable({
    providedIn: 'root'
})
export class ApplicationRepository {
    private http = inject(HttpClient);

    createApplication(request: CreateApplicationRequest): Observable<Application> {
        return this.http.post<ApiResponse<Application>>(
            API_ENDPOINTS.APPLICATIONS.BASE,
            request
        ).pipe(map(res => res.data!));
    }

    updateApplication(id: string, request: UpdateApplicationRequest): Observable<Application> {
        return this.http.put<ApiResponse<Application>>(
            `${API_ENDPOINTS.APPLICATIONS.BASE}/${id}`,
            request
        ).pipe(map(res => res.data!));
    }

    getApplicationById(id: string): Observable<Application> {
        return this.http.get<ApiResponse<Application>>(
            `${API_ENDPOINTS.APPLICATIONS.BASE}/${id}`
        ).pipe(map(res => res.data!));
    }

    getApplications(filters?: {
        status?: ApplicationStatus;
        applicantPhone?: string;
        jspId?: string;
        fromDate?: string;
        toDate?: string;
        page?: number;
        limit?: number;
    }): Observable<{ applications: Application[]; total: number; page: number; totalPages: number }> {
        let params = new HttpParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }

        return this.http.get<ApiResponse<Application[]>>(
            API_ENDPOINTS.APPLICATIONS.BASE,
            { params }
        ).pipe(
            map(res => ({
                applications: res.data!,
                total: res.meta?.total || 0,
                page: res.meta?.page || 1,
                totalPages: res.meta?.totalPages || 1,
            }))
        );
    }

    submitApplication(id: string): Observable<Application> {
        return this.http.post<ApiResponse<Application>>(
            API_ENDPOINTS.APPLICATIONS.SUBMIT(id),
            {}
        ).pipe(map(res => res.data!));
    }

    approveApplication(id: string, remarks?: string): Observable<Application> {
        return this.http.post<ApiResponse<Application>>(
            API_ENDPOINTS.APPLICATIONS.APPROVE(id),
            { remarks }
        ).pipe(map(res => res.data!));
    }

    rejectApplication(id: string, remarks?: string): Observable<Application> {
        return this.http.post<ApiResponse<Application>>(
            API_ENDPOINTS.APPLICATIONS.REJECT(id),
            { remarks }
        ).pipe(map(res => res.data!));
    }

    requestCorrectionApplication(id: string, remarks?: string): Observable<Application> {
        return this.http.post<ApiResponse<Application>>(
            API_ENDPOINTS.APPLICATIONS.REQUEST_CORRECTION(id),
            { remarks }
        ).pipe(map(res => res.data!));
    }

    getStatistics(): Observable<ApplicationStatistics> {
        return this.http.get<ApiResponse<ApplicationStatistics>>(
            API_ENDPOINTS.APPLICATIONS.STATISTICS
        ).pipe(map(res => res.data!));
    }
}
