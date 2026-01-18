export type FacilityType = 'office' | 'warehouse' | 'factory' | 'retail' | 'data_center' | 'other';

export interface Facility {
  id: string;
  organizationId: string;
  name: string;
  facilityType: FacilityType;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  gridRegion: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacilityRequest {
  name: string;
  facilityType?: FacilityType;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  gridRegion?: string;
}

export interface GeocodeResponse {
  address: string;
  latitude: number;
  longitude: number;
  gridRegion: string;
  message: string;
}
