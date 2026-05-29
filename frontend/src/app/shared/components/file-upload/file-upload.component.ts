import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

export interface UploadedFile {
    file: File;
    preview?: string;
    progress?: number;
    uploaded?: boolean;
}

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './file-upload.component.html',
    styles: [`
    .file-upload-container {
      width: 100%;
    }

    .drop-zone {
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      padding: 3rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #f9fafb;
    }

    .drop-zone:hover {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }

    .drop-zone.drag-over {
      border-color: #3b82f6;
      background-color: #dbeafe;
      border-style: solid;
    }

    .hidden {
      display: none;
    }

    .drop-zone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .upload-icon {
      width: 3rem;
      height: 3rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .file-list {
      margin-top: 1rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .file-preview {
      width: 3rem;
      height: 3rem;
      flex-shrink: 0;
      margin-right: 0.75rem;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.25rem;
    }

    .file-icon {
      width: 100%;
      height: 100%;
      color: #6b7280;
    }

    .file-info {
      flex: 1;
      min-width: 0;
    }

    .file-name {
      font-weight: 500;
      color: #111827;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background-color: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: #3b82f6;
      transition: width 0.3s ease;
    }

    .status-icon {
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
      margin-left: 0.75rem;
    }

    .delete-btn {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      margin-left: 0.75rem;
      color: #ef4444;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-btn:hover {
      background-color: #fee2e2;
    }

    .delete-btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .error-message {
      padding: 0.75rem;
      background-color: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 0.5rem;
      color: #991b1b;
      font-size: 0.875rem;
    }
  `]
})
export class FileUploadComponent {
    @Input() multiple = false;
    @Input() acceptedTypes = environment.allowedFileTypes.join(',');
    @Input() maxSize = environment.uploadMaxSize;

    @Output() filesChanged = new EventEmitter<File[]>();

    files = signal<UploadedFile[]>([]);
    isDragging = signal(false);
    errorMessage = signal('');

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);

        const droppedFiles = event.dataTransfer?.files;
        if (droppedFiles) {
            this.handleFiles(Array.from(droppedFiles));
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
            input.value = ''; // Reset input
        }
    }

    private handleFiles(selectedFiles: File[]): void {
        this.errorMessage.set('');

        // Validate file count
        if (!this.multiple && selectedFiles.length > 1) {
            this.errorMessage.set('Please select only one file');
            return;
        }

        const validFiles: UploadedFile[] = [];

        for (const file of selectedFiles) {
            // Validate file type
            if (!this.isValidFileType(file)) {
                this.errorMessage.set(`Invalid file type: ${file.name}. Allowed types: ${this.getAllowedTypesText()}`);
                continue;
            }

            // Validate file size
            if (file.size > this.maxSize) {
                this.errorMessage.set(`File too large: ${file.name}. Max size: ${this.getMaxSizeMB()}MB`);
                continue;
            }

            const uploadedFile: UploadedFile = {
                file,
                progress: 0,
                uploaded: false
            };

            // Generate preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedFile.preview = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            }

            validFiles.push(uploadedFile);
        }

        if (validFiles.length > 0) {
            if (this.multiple) {
                this.files.update(current => [...current, ...validFiles]);
            } else {
                this.files.set(validFiles);
            }

            // Simulate upload progress
            validFiles.forEach(uploadedFile => {
                this.simulateUploadProgress(uploadedFile);
            });

            this.emitFiles();
        }
    }

    private simulateUploadProgress(uploadedFile: UploadedFile): void {
        const interval = setInterval(() => {
            const currentProgress = uploadedFile.progress || 0;
            if (currentProgress >= 100) {
                uploadedFile.uploaded = true;
                clearInterval(interval);
                this.files.set([...this.files()]); // Trigger update
            } else {
                uploadedFile.progress = Math.min(currentProgress + 10, 100);
                this.files.set([...this.files()]); // Trigger update
            }
        }, 100);
    }

    removeFile(uploadedFile: UploadedFile): void {
        this.files.update(current => current.filter(f => f !== uploadedFile));
        this.emitFiles();
    }

    private emitFiles(): void {
        const fileList = this.files().map(uf => uf.file);
        this.filesChanged.emit(fileList);
    }

    private isValidFileType(file: File): boolean {
        const allowedTypes = environment.allowedFileTypes;
        return allowedTypes.includes(file.type);
    }

    getAllowedTypesText(): string {
        return 'PDF, PNG, JPG, JPEG';
    }

    getMaxSizeMB(): number {
        return this.maxSize / (1024 * 1024);
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    // Public method to clear all files
    clearFiles(): void {
        this.files.set([]);
        this.emitFiles();
    }

    // Public method to get current files
    getFiles(): File[] {
        return this.files().map(uf => uf.file);
    }
}
