import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslationService } from '@core/services/translation.service';
import { UploadedDocument } from '@features/data-capture/data-capture.component';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-preview.component.html',
  styleUrl: './document-preview.component.scss',
})
export class DocumentPreviewComponent {
  protected translationService = inject(TranslationService);
  private fb = new FormBuilder();

  document = input.required<UploadedDocument>();
  confirmData = output<any>();
  reject = output<void>();

  zoomLevel = signal(1);

  extractedDataForm = this.fb.group({
    vendor: ['', Validators.required],
    date: ['', Validators.required],
    consumption: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
    totalCost: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
    notes: [''],
  });

  ngOnInit() {
    // Initialize form with document data
    const data = this.document().extractedData;
    if (data) {
      this.extractedDataForm.patchValue({
        vendor: data.vendor,
        date: data.date,
        consumption: data.consumption,
        totalCost: data.totalCost,
        notes: data.notes,
      });
    }
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
    this.reject.emit();
  }

  getConfidence(): number {
    return this.document().extractedData?.confidence || 0;
  }
}
