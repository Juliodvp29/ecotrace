export interface DataEntry {
  id: string;
  vendorName: string;
  entryDate: string;
  quantity: number;
  unit: string;
  totalCost: number;
  co2eKg: number | null;
  confidenceLevel: 'high' | 'medium' | 'low';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  category: 'electricity' | 'water' | 'fuel';
  facilityId?: string;
  notes?: string;
  originalUrl?: string;
  createdAt: string;
  updatedAt: string;
  // UI helpers
  filename?: string;
  size?: string;
}

export interface OCRResult {
  vendor: string;
  date: string;
  consumption: number;
  unit: string;
  totalCost: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface ProcessDocumentResponse {
  dataEntry: DataEntry;
  ocrResult: OCRResult;
  message: string;
}

export interface DataEntryStats {
  totalEntries: number;
  totalCO2e: number;
  byCategory: Record<string, number>;
}
