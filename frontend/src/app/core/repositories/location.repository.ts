import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { District, Constituency, Mandal } from '../models/location.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class LocationRepository {
    private http = inject(HttpClient);

    getDistricts(): Observable<ApiResponse<District[]>> {
        return this.http.get<ApiResponse<District[]>>(
            API_ENDPOINTS.LOCATIONS.DISTRICTS
        );
    }

    getConstituencies(districtId: string): Observable<ApiResponse<Constituency[]>> {
        return this.http.get<ApiResponse<Constituency[]>>(
            `${API_ENDPOINTS.LOCATIONS.CONSTITUENCIES}?districtId=${districtId}`
        );
    }

    getMandals(constituencyId: string): Observable<ApiResponse<Mandal[]>> {
        return this.http.get<ApiResponse<Mandal[]>>(
            `${API_ENDPOINTS.LOCATIONS.MANDALS}?constituencyId=${constituencyId}`
        );
    }
}
