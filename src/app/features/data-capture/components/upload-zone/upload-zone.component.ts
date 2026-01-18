import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-zone.component.html',
  styleUrl: './upload-zone.component.scss',
})
export class UploadZoneComponent {
  protected translationService = inject(TranslationService);
  filesSelected = output<FileList>();
  isDragging = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  }

  private handleFiles(files: FileList) {
    // Basic validation
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 25 * 1024 * 1024; // 25MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        console.error(`Invalid file type: ${file.name}`);
        continue;
      }
      if (file.size > maxSize) {
        console.error(`File too large: ${file.name}`);
        continue;
      }
    }

    this.filesSelected.emit(files);
  }
}
