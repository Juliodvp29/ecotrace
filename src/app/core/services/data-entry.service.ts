import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { DataEntry, DataEntryStats, ProcessDocumentResponse } from '../models/data-entry.interface';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService {
  private api = inject(ApiHttpService);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Process a document using OCR
   * POST /api/v1/data-entries/process-document
   */
  processDocument(
    file: File,
    category: string,
    facilityId?: string,
    notes?: string,
  ): Observable<ProcessDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (facilityId) formData.append('facilityId', facilityId);
    if (notes) formData.append('notes', notes);

    return this.http.post<ProcessDocumentResponse>(
      `${this.apiUrl}/data-entries/process-document`,
      formData,
    );
  }

  /**
   * Create a manual entry
   * POST /api/v1/data-entries
   */
  createEntry(data: Partial<DataEntry>): Observable<DataEntry> {
    return this.api.post<DataEntry>('data-entries', data);
  }

  /**
   * List all entries
   * GET /api/v1/data-entries
   */
  getEntries(startDate?: string, endDate?: string): Observable<DataEntry[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.api.get<DataEntry[]>('data-entries', params);
  }

  /**
   * Get a single entry by ID
   * GET /api/v1/data-entries/{id}
   */
  getEntryById(id: string): Observable<DataEntry> {
    return this.api.get<DataEntry>(`data-entries/${id}`);
  }

  /**
   * Update an entry
   * PUT /api/v1/data-entries/{id}
   */
  updateEntry(id: string, data: Partial<DataEntry>): Observable<DataEntry> {
    return this.api.put<DataEntry>(`data-entries/${id}`, data);
  }

  /**
   * Verify an entry
   * PUT /api/v1/data-entries/{id}/verify
   */
  verifyEntry(id: string): Observable<DataEntry> {
    return this.api.put<DataEntry>(`data-entries/${id}/verify`, {});
  }

  /**
   * Reject an entry
   * PUT /api/v1/data-entries/{id}/reject
   */
  rejectEntry(id: string, notes: string): Observable<DataEntry> {
    return this.api.put<DataEntry>(`data-entries/${id}/reject`, { notes });
  }

  /**
   * Delete an entry
   * DELETE /api/v1/data-entries/{id}
   */
  deleteEntry(id: string): Observable<void> {
    return this.api.delete<void>(`data-entries/${id}`);
  }

  /**
   * Get statistics
   * GET /api/v1/data-entries/stats
   */
  getStats(year?: number): Observable<DataEntryStats> {
    const params = year ? { year } : {};
    return this.api.get<DataEntryStats>('data-entries/stats', params);
  }
}
