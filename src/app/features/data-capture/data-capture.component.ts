import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';
import { ActivityTableComponent } from './components/activity-table/activity-table.component';
import { DocumentPreviewComponent } from './components/document-preview/document-preview.component';
import { UploadZoneComponent } from './components/upload-zone/upload-zone.component';

export interface UploadedDocument {
  id: string;
  filename: string;
  size: string;
  date: string;
  category: 'electricity' | 'water' | 'fuel';
  status: 'processing' | 'verified' | 'action_required';
  extractedData?: {
    vendor: string;
    date: string;
    consumption: string;
    totalCost: string;
    notes: string;
    confidence: number;
  };
  previewUrl?: string;
}

@Component({
  selector: 'app-data-capture',
  standalone: true,
  imports: [CommonModule, UploadZoneComponent, ActivityTableComponent, DocumentPreviewComponent],
  templateUrl: './data-capture.component.html',
})
export class DataCaptureComponent implements OnInit {
  protected translationService = inject(TranslationService);
  selectedDocument = signal<UploadedDocument | null>(null);

  // Mock data for demonstration
  documents = signal<UploadedDocument[]>([
    {
      id: '1',
      filename: 'Invoice_Oct_2023.pdf',
      size: '1.2 MB',
      date: 'Oct 24, 2023',
      category: 'electricity',
      status: 'processing',
      extractedData: {
        vendor: 'Green Energy Corp',
        date: 'Oct 24, 2023',
        consumption: '450.00',
        totalCost: '120.50',
        notes: 'Quarterly sustainability check required.',
        confidence: 92,
      },
      previewUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCjkHRUTJZR-lw-No1VsAZD-QlDTHeI9W-a38kGe_8-bUvZKlZ1BEmxjHJ9Gr6PLPLhm8Lw0bbIWeryytKerdHcgovMeTnrj2WHWe9t4jOqXOHouvEX7vh0xGKfdZJ3apaD1OprmOBv637M6nPj0-xnCHbPqiz6Vxx4D4FCSdmsnE-uyfeKEIM88wiXAaAwvw72qDILp8Mk9W2WfDrw3iWPGQeq-yMPv3nWZ4EmeimtM0q9C_PXUtyJaqQXaCSTAzAPJb2mbMFPIUfa',
    },
    {
      id: '2',
      filename: 'Water_Bill_Sep.jpg',
      size: '3.4 MB',
      date: 'Oct 22, 2023',
      category: 'water',
      status: 'verified',
    },
    {
      id: '3',
      filename: 'Fuel_Receipt_004.png',
      size: '0.8 MB',
      date: 'Oct 20, 2023',
      category: 'fuel',
      status: 'action_required',
    },
  ]);

  ngOnInit() {
    this.selectedDocument.set(this.documents()[0]);
  }

  onDocumentSelect(document: UploadedDocument) {
    this.selectedDocument.set(document);
  }

  onFileUpload(files: FileList) {
    // TODO: Implement actual upload logic when API is ready
    console.log('Files uploaded:', files);
  }

  onConfirmData(data: any) {
    // TODO: Send confirmed data to API
    console.log('Data confirmed:', data);
    this.selectedDocument.set(null);
  }

  onRejectDocument() {
    // TODO: Handle document rejection
    console.log('Document rejected');
    this.selectedDocument.set(null);
  }
}
