import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { BookingGet } from '../../Interfaces/booking';
import { BookingService } from '../booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unverified-bookings',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule],
  templateUrl: './unverified-bookings.component.html',
  styleUrl: './unverified-bookings.component.scss'
})
export class UnverifiedBookingsComponent {
  bookings: BookingGet[] = [];

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.bookingService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings.filter((booking) => booking.status === 'pending');  
    });
  }

  onEditBooking(id: number) {}
  onDeleteBooking(id: number) {}
}
