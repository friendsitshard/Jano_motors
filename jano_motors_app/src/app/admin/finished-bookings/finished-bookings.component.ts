import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { BookingGet } from '../../Interfaces/booking';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-finished-bookings',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule],
  templateUrl: './finished-bookings.component.html',
  styleUrl: './finished-bookings.component.scss'
})
export class FinishedBookingsComponent {
  bookings: BookingGet[] = [];

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.bookingService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings.filter((booking) => booking.status === 'finished');  
    });
  }

  onEditBooking(id: number) {}
  onDeleteBooking(id: number) {}
}
