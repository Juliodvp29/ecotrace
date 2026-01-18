export interface Organization {
  id: string;
  legalName: string;
  fiscalId: string;
  industrySector: string | null;
  geographicLocation: string | null;
  logoUrl: string | null;
  defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'MXN' | 'COP' | 'BRL';
  distanceUnit: 'km' | 'miles';
  volumeUnit: 'liters' | 'gallons';
  memberCount: number;
  facilityCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  legalName: string;
  fiscalId: string;
  industrySector?: string;
  geographicLocation?: string;
  defaultCurrency?: string;
  distanceUnit?: string;
  volumeUnit?: string;
}

export interface CreateOrganizationResponse {
  organization: Organization;
  message: string;
}
