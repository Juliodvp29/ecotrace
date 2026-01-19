import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataEntry } from '@core/models/data-entry.interface';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-preview.component.html',
  styleUrl: './document-preview.component.scss',
})
export class DocumentPreviewComponent {
  protected translationService = inject(TranslationService);
  private fb = inject(FormBuilder);

  document = input.required<DataEntry>();
  confirmData = output<any>();
  reject = output<string>(); // Emit rejection notes

  zoomLevel = signal(1);

  extractedDataForm = this.fb.group({
    vendor: ['', Validators.required],
    date: ['', Validators.required],
    consumption: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
    totalCost: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
    notes: [''],
  });

  constructor() {
    effect(() => {
      const doc = this.document();
      if (doc) {
        this.extractedDataForm.patchValue({
          vendor: doc.vendorName || '',
          date: doc.entryDate || '',
          consumption: doc.quantity?.toString() || '',
          totalCost: doc.totalCost?.toString() || '',
          notes: doc.notes || '',
        });
      }
    });
  }

  zoomIn() {
    this.zoomLevel.update((level) => Math.min(level + 0.2, 3));
  }

  zoomOut() {
    this.zoomLevel.update((level) => Math.max(level - 0.2, 0.5));
  }

  onConfirm() {
    if (this.extractedDataForm.valid) {
      this.confirmData.emit(this.extractedDataForm.value);
    }
  }

  onReject() {
    const notes = this.extractedDataForm.get('notes')?.value || 'Rejected by user';
    this.reject.emit(notes);
  }

  getConfidence(): number {
    const level = this.document().confidenceLevel;
    switch (level) {
      case 'high':
        return 95;
      case 'medium':
        return 75;
      case 'low':
        return 45;
      default:
        return 0;
    }
  }
}
