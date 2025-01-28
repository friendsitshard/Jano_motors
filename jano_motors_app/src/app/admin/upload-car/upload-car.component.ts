import { Component } from '@angular/core';
import { CarService } from '../car.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-car',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './upload-car.component.html',
  styleUrls: ['./upload-car.component.scss'] // Fixed property name
})
export class UploadCarComponent {
  carForm!: FormGroup;
  mainImage: any;
  
  constructor(
    private fb: FormBuilder,
    private carService: CarService,
  ) {
    this.carForm = this.fb.group({
      make: [''],
      model: [''],
      year: [''],
      transmission: [''],
      passengers: [''],
      dailyPrice: [''],
      horsePower: [''],
      engineType: [''],
      driverPrice: [''],
      airportPrice: [''],
      mainImage: [''],
    })
  }

  onSubmit() {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('make', this.carForm.value.make);
    formData.append('model', this.carForm.value.model);
    formData.append('year', this.carForm.value.year);
    formData.append('transmission', this.carForm.value.transmission);
    formData.append('passengers', this.carForm.value.passengers);
    formData.append('dailyPrice', this.carForm.value.dailyPrice);
    formData.append('horsePower', this.carForm.value.horsePower);
    formData.append('engineType', this.carForm.value.engineType);
    formData.append('driverPrice', this.carForm.value.driverPrice);
    formData.append('airportPrice', this.carForm.value.airportPrice);
    formData.append('mainImage', this.carForm.value.mainImage);

    this.carService.uploadCar(formData).subscribe({
      next: () => {
        console.log('Car uploaded');
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    })
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.carForm.get('mainImage')?.setValue(event.target.files[0]);
      this.mainImage = event.target.files[0];
    }
  }
}
