import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DataEntry } from '@core/models/data-entry.interface';
import { DataEntryService } from '@core/services/data-entry.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { ActivityTableComponent } from './components/activity-table/activity-table.component';
import { DocumentPreviewComponent } from './components/document-preview/document-preview.component';
import { UploadZoneComponent } from './components/upload-zone/upload-zone.component';

@Component({
  selector: 'app-data-capture',
  standalone: true,
  imports: [CommonModule, UploadZoneComponent, ActivityTableComponent, DocumentPreviewComponent],
  templateUrl: './data-capture.component.html',
})
export class DataCaptureComponent implements OnInit {
  protected translationService = inject(TranslationService);
  private dataEntryService = inject(DataEntryService);
  private toastService = inject(ToastService);

  selectedDocument = signal<DataEntry | null>(null);
  documents = signal<DataEntry[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.refreshEntries();
  }

  refreshEntries() {
    this.isLoading.set(true);
    this.dataEntryService.getEntries().subscribe({
      next: (entries) => {
        // Map backend entries to provide UI helpers if necessary
        this.documents.set(entries);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Error loading documents');
        this.isLoading.set(false);
      },
    });
  }

  onDocumentSelect(document: DataEntry) {
    this.selectedDocument.set(document);
  }

  async onFileUpload(files: FileList) {
    if (files.length === 0) return;

    this.isLoading.set(true);
    const file = files[0];

    // Default to electricity for now or prompt user
    // For now we'll use a fixed category or the first one
    const category = 'electricity';

    this.dataEntryService.processDocument(file, category).subscribe({
      next: (response) => {
        this.toastService.success(
          this.translationService.translate('dataCapture.uploadSuccess') || 'Document processed',
        );
        this.refreshEntries();
        this.selectedDocument.set(response.dataEntry);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Error processing document');
        this.isLoading.set(false);
      },
    });
  }

  onConfirmData(formData: any) {
    const doc = this.selectedDocument();
    if (!doc) return;

    this.isLoading.set(true);
    // First update the entry with potentially edited data
    this.dataEntryService
      .updateEntry(doc.id, {
        vendorName: formData.vendor,
        entryDate: formData.date,
        quantity: parseFloat(formData.consumption),
        totalCost: parseFloat(formData.totalCost),
        notes: formData.notes,
      })
      .subscribe({
        next: () => {
          // Then verify
          this.dataEntryService.verifyEntry(doc.id).subscribe({
            next: () => {
              this.toastService.success('Data verified successfully');
              this.selectedDocument.set(null);
              this.refreshEntries();
            },
            error: () => {
              this.toastService.error('Error verifying data');
              this.isLoading.set(false);
            },
          });
        },
        error: () => {
          this.toastService.error('Error updating document data');
          this.isLoading.set(false);
        },
      });
  }

  onRejectDocument(notes: string) {
    const doc = this.selectedDocument();
    if (!doc) return;

    this.isLoading.set(true);
    this.dataEntryService.rejectEntry(doc.id, notes).subscribe({
      next: () => {
        this.toastService.info('Document rejected');
        this.selectedDocument.set(null);
        this.refreshEntries();
      },
      error: () => {
        this.toastService.error('Error rejecting document');
        this.isLoading.set(false);
      },
    });
  }
}
