import { Component } from '@angular/core';
import { CarService } from '../car.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-car-images',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './upload-car-images.component.html',
  styleUrls: ['./upload-car-images.component.scss'] // Corrected to `styleUrls`
})
export class UploadCarImagesComponent {
  uploadForm: FormGroup;
  uploadResponse: any;

  constructor(private fb: FormBuilder, private carService: CarService) {
    this.uploadForm = this.fb.group({
      carId: [null, [Validators.required, Validators.min(1)]],
      files: this.fb.array([this.createFileGroup()]),
    });
  }

  get filesArray(): FormArray {
    return this.uploadForm.get('files') as FormArray;
  }

  createFileGroup(): FormGroup {
    return this.fb.group({
      file: [null, Validators.required],
    });
  }

  addFileInput(): void {
    this.filesArray.push(this.createFileGroup());
  }

  removeFileInput(index: number): void {
    if (this.filesArray.length > 1) {
      this.filesArray.removeAt(index);
    }
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.filesArray.at(index).get('file')?.setValue(file);
    }
  }

  uploadFiles(): void {
    const carId = this.uploadForm.get('carId')?.value;
    const files = this.filesArray.controls
      .map(group => group.get('file')?.value)
      .filter(file => file !== null);

    if (carId && files.length > 0) {
      this.carService.bulkUploadDocs(carId, files).subscribe({
        next: (response) => {
          this.uploadResponse = response;
          alert('Files uploaded successfully!');
        },
        error: (error) => {
          console.error('Error uploading files:', error);
          alert('Failed to upload files.');
        },
      });
    } else {
      alert('Please select files and provide a valid Car ID.');
    }
  }
}
