import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document, DocumentType } from '../models/document.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
    providedIn: 'root'
})
export class DocumentRepository {
    private http = inject(HttpClient);

    uploadDocument(applicationId: string, documentType: DocumentType, file: File): Observable<Document> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('applicationId', applicationId);
        formData.append('documentType', documentType);

        return this.http.post<ApiResponse<Document>>(
            API_ENDPOINTS.DOCUMENTS.UPLOAD,
            formData
        ).pipe(map(res => res.data!));
    }

    getDocumentsByApplicationId(applicationId: string): Observable<Document[]> {
        return this.http.get<ApiResponse<Document[]>>(
            API_ENDPOINTS.DOCUMENTS.BY_APPLICATION(applicationId)
        ).pipe(map(res => res.data!));
    }

    downloadDocument(id: string): Observable<Blob> {
        return this.http.get(
            API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id),
            { responseType: 'blob' }
        );
    }

    viewDocument(id: string): Observable<Blob> {
        return this.http.get(
            API_ENDPOINTS.DOCUMENTS.VIEW(id),
            { responseType: 'blob' }
        );
    }

    deleteDocument(id: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(
            API_ENDPOINTS.DOCUMENTS.DELETE(id)
        ).pipe(map(() => undefined));
    }
}
