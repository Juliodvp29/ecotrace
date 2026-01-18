import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFacilityRequest, Facility, GeocodeResponse } from '../models/facility.interface';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class FacilityService {
  private api = inject(ApiHttpService);

  createFacility(data: CreateFacilityRequest): Observable<{ facility: Facility; message: string }> {
    return this.api.post<{ facility: Facility; message: string }>('facilities', data);
  }

  getFacilities(): Observable<Facility[]> {
    return this.api.get<Facility[]>('facilities');
  }

  getFacilityById(id: string): Observable<Facility> {
    return this.api.get<Facility>(`facilities/${id}`);
  }

  updateFacility(
    id: string,
    data: Partial<CreateFacilityRequest>,
  ): Observable<{ facility: Facility; message: string }> {
    return this.api.put<{ facility: Facility; message: string }>(`facilities/${id}`, data);
  }

  deleteFacility(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`facilities/${id}`);
  }

  geocode(address: string): Observable<GeocodeResponse> {
    return this.api.post<GeocodeResponse>('facilities/geocode', { address });
  }
}
