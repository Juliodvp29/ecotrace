import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';
import { UploadedDocument } from '@features/data-capture/data-capture.component';

@Component({
  selector: 'app-activity-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-table.component.html',
})
export class ActivityTableComponent {
  protected translationService = inject(TranslationService);
  documents = input.required<UploadedDocument[]>();
  selectedDocument = input<UploadedDocument | null>();
  documentSelected = output<UploadedDocument>();

  getFileIcon(filename: string): string {
    if (filename.endsWith('.pdf')) return 'picture_as_pdf';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png'))
      return 'image';
    return 'description';
  }

  getFileIconColor(filename: string): string {
    if (filename.endsWith('.pdf')) return 'text-red-500';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'text-blue-500';
    if (filename.endsWith('.png')) return 'text-purple-500';
    return 'text-gray-500';
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'electricity':
        return 'bolt';
      case 'water':
        return 'water_drop';
      case 'fuel':
        return 'local_gas_station';
      default:
        return 'category';
    }
  }

  getCategoryClasses(category: string): string {
    switch (category) {
      case 'electricity':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-800';
      case 'water':
        return 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800';
      case 'fuel':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 border-orange-100 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800/20 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800';
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'processing':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800';
      case 'verified':
        return 'bg-primary/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'action_required':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'verified':
        return 'check_circle';
      case 'action_required':
        return 'error';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'processing':
        return this.translationService.translate('dataCapture.activity.status.processing');
      case 'verified':
        return this.translationService.translate('dataCapture.activity.status.verified');
      case 'action_required':
        return this.translationService.translate('dataCapture.activity.status.actionRequired');
      default:
        return status;
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'electricity':
        return this.translationService.translate('dataCapture.activity.categories.electricity');
      case 'water':
        return this.translationService.translate('dataCapture.activity.categories.water');
      case 'fuel':
        return this.translationService.translate('dataCapture.activity.categories.fuel');
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  }

  onRowClick(document: UploadedDocument) {
    this.documentSelected.emit(document);
  }

  isSelected(document: UploadedDocument): boolean {
    return this.selectedDocument()?.id === document.id;
  }
}
