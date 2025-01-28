import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../car.service';

@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-car.component.html',
  styleUrl: './edit-car.component.scss'
})
export class EditCarComponent {
  carForm!: FormGroup;
  mainImage: any;
  carId!: number;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carId = Number(this.route.snapshot.paramMap.get('id'));

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
      mainImage: ['']
    });

    this.loadCarDetails();
  }

  loadCarDetails(): void {
    this.carService.getCarDetailsById(this.carId).subscribe({
      next: (car) => {
        this.carForm.patchValue({
          make: car.make,
          model: car.model,
          year: car.year,
          transmission: car.transmission,
          passengers: car.passengers,
          dailyPrice: car.dailyPrice,
          mainImage: car.mainImage,
          horsePower: car.horsePower,
          engineType: car.engineType,
          driverPrice: car.driverPrice,
          airportPrice: car.airportPrice
        });
        console.log(this.carForm.value)
      },
      error: (error) => console.error('Error loading car details:', error)
    });


  }

  onSubmit(): void {
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

    if (this.carForm.value.mainImage) {
      formData.append('mainImage', this.carForm.value.mainImage);
    }

    this.carService.updateCar(this.carId, formData).subscribe({
      next: () => {
        console.log('Car updated successfully');
        this.router.navigate(['admin/all-cars']);
      },
      error: (error) => {
        console.error('Error updating car:', error);
      }
    });

  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.carForm.get('mainImage')?.setValue(event.target.files[0]);
      this.mainImage = event.target.files[0];
    }
  }
}
