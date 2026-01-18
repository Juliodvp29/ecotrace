import { Injectable, inject } from '@angular/core';
import {
    CreateOrganizationRequest,
    CreateOrganizationResponse,
    Organization,
} from '@core/models/organization.interface';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private api = inject(ApiHttpService);

  createOrganization(data: CreateOrganizationRequest): Observable<CreateOrganizationResponse> {
    return this.api.post<CreateOrganizationResponse>('organizations', data);
  }

  getMyOrganization(): Observable<Organization> {
    return this.api.get<Organization>('organizations/me');
  }

  updateOrganization(
    id: string,
    data: Partial<Organization>,
  ): Observable<{ organization: Organization; message: string }> {
    return this.api.put<{ organization: Organization; message: string }>(
      `organizations/${id}`,
      data,
    );
  }

  getOrganizationUsers(id: string): Observable<any[]> {
    return this.api.get<any[]>(`organizations/${id}/users`);
  }
}
