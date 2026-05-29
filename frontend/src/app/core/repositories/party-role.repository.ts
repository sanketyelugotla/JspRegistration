import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartyRole } from '../models/party-role.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class PartyRoleRepository {
    private http = inject(HttpClient);

    getPartyRoles(): Observable<ApiResponse<PartyRole[]>> {
        return this.http.get<ApiResponse<PartyRole[]>>(
            API_ENDPOINTS.PARTY_ROLES.BASE
        );
    }

    getActiveRoles(): Observable<PartyRole[]> {
        return this.http.get<ApiResponse<PartyRole[]>>(
            API_ENDPOINTS.PARTY_ROLES.BASE
        ).pipe(map(res => res.data!));
    }

    getAllRoles(): Observable<PartyRole[]> {
        return this.http.get<ApiResponse<PartyRole[]>>(
            API_ENDPOINTS.PARTY_ROLES.ALL
        ).pipe(map(res => res.data!));
    }

    createRole(name: string): Observable<PartyRole> {
        return this.http.post<ApiResponse<PartyRole>>(
            API_ENDPOINTS.PARTY_ROLES.BASE,
            { name }
        ).pipe(map(res => res.data!));
    }

    updateRole(id: string, name: string, active: boolean): Observable<PartyRole> {
        return this.http.put<ApiResponse<PartyRole>>(
            `${API_ENDPOINTS.PARTY_ROLES.BASE}/${id}`,
            { name, active }
        ).pipe(map(res => res.data!));
    }

    deleteRole(id: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(
            `${API_ENDPOINTS.PARTY_ROLES.BASE}/${id}`
        ).pipe(map(() => undefined));
    }
}
