import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '../../Interfaces/car';
import { CarService } from '../car.service';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-all-car',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent],
  templateUrl: './all-car.component.html',
  styleUrl: './all-car.component.scss'
})
export class AllCarComponent {
  cars: Car[] = [];

  constructor(
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carService.getAllCars().subscribe((cars) => {
      this.cars = cars;
    });
  }

  onEditCar(id: number) {
    this.router.navigate(['admin', 'edit-car', id]);
  }

  onDeleteCar(id: number) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => {
          this.cars = this.cars.filter(car => car.id !== id);
          alert('Car deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting car:', err);
          alert('Failed to delete car. Please try again.');
        }
      });
    }
  }
}
