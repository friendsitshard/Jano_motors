import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { CommonModule } from '@angular/common';
import { BookingGet } from '../../Interfaces/booking';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-verified-bookings',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule],
  templateUrl: './verified-bookings.component.html',
  styleUrl: './verified-bookings.component.scss'
})
export class VerifiedBookingsComponent {
  bookings: BookingGet[] = [];

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.bookingService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings.filter((booking) => booking.status === 'active');  
    });
  }

  onEditBooking(id: number) {}
  onDeleteBooking(id: number) {}
}
