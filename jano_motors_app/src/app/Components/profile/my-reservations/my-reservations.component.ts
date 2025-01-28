import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { CarsService } from '../../../Services/cars.service';
import { AuthService } from '../../../Services/auth.service';
import { BookingService } from '../../../Services/booking.service';
import { Booking } from '../../../Interfaces/booking';
@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {
  reservations!: any[];

  constructor(
    private carsService: CarsService,
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getLogedInUserId();
    if (userId) {
      this.bookingService.getUsersBookings(userId).subscribe({
        next: (response) => {
          const carNameObservables = response.map((reservation: any) => 
            this.getCarName(reservation.carId).pipe(
              map(carName => ({
                id: reservation.id,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                totalPrice: reservation.totalPrice,
                status: reservation.status,
                carName: carName
              }))
            )
          );
          forkJoin(carNameObservables).subscribe({
            next: (reservations) => {
              this.reservations = reservations;
            },
            error: (err) => {
              console.log(err);
            }
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getCarName(id: number) {
    return this.carsService.getCarById(id).pipe(
      map(car => `${car.make} ${car.model}`),
      catchError(err => {
        console.log(err);
        return of('Unknown Car');
      })
    );
  }

}
