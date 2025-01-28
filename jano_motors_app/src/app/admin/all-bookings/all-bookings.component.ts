import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { BookingService } from '../booking.service';
import { BookingGet } from '../../Interfaces/booking';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule],
  templateUrl: './all-bookings.component.html',
  styleUrl: './all-bookings.component.scss'
})
export class AllBookingsComponent implements OnInit {
  bookings: BookingGet[] = [];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.bookingService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings;
    });
  }

  onEditBooking(id: number) {
    this.router.navigate(['admin', 'booking-details', id]);
  }
  onDeleteBooking(id: number) {}

}
