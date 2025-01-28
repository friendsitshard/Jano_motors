import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';
import { BookingGet } from '../../Interfaces/booking';
import { UserInfo } from '../../Interfaces/user-info';
import { UserService } from '../user.service';
import { CarService } from '../car.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent implements OnInit{
  booking!: any;
  user: any;
  car: any;

  newStatus: string = '';

  formGroup!: FormGroup;

  invoiceIMG!: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private userService: UserService,
    private carService: CarService
  ) { }


  ngOnInit() {
    this.formGroup = this.fb.group({
      invoice: ['']
    });
    
    const bookingId = +this.route.snapshot.paramMap.get('id')!;
    console.log('bookingId', bookingId);
    this.bookingService.getBookingDetails(bookingId, this.car).subscribe({
      next: (data: any) => {
        console.log(data);
        this.booking = data;
        this.invoiceIMG = data.invoice;
        this.userService.getUserDetailsById(this.booking.userId).subscribe({
          next: (data: any) => {
            this.user = data;
          },
          error: (error) => {
            console.error(error);
          }
        });
        this.carService.getCarDetailsById(this.booking.carId).subscribe({
          next: (data: any) => {
            this.car = data;
          },
          error: (error) => {
            console.error(error);
          }
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('invoiceFile', this.invoiceIMG);
    this.bookingService.uploadInvoice(this.booking.id, formData).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  approveBooking(bookingId: number) {
    this.newStatus = 'active';
    this.bookingService.changeBookingStatus(bookingId, this.newStatus).subscribe({
      next: (response) => {
        console.log('Booking approved:', response);
        alert(`Booking approved. Status: ${response.Status}`);
      },
      error: (error) => {
        console.error('Error approving booking:', error);
        alert('Error approving booking. Please try again.');
      },
    });
  }

  rejectBooking(bookingId: number) {
    this.newStatus = 'cancelled';
    this.bookingService.changeBookingStatus(bookingId,  this.newStatus).subscribe({
      next: (response) => {
        console.log('Booking rejected:', response);
        alert(`Booking rejected. Status: ${response.Status}`);
      },
      error: (error) => {
        console.error('Error rejecting booking:', error);
        alert('Error rejecting booking. Please try again.');
      },
    });
  }

  doit() {

    console.log('booking', this.booking)
    console.log('user', this.user)
    console.log('car', this.car)
  }

  invoice(event: any) {
    console.log('event: ', event)
    if (event.target.files && event.target.files.length > 0) {
      this.formGroup.patchValue({
        invoice: event.target.files[0]
      });
      this.invoiceIMG = event.target.files[0];
    }
  }

  getBookingDays() {
    const startDate = new Date(this.booking.startDate);
    const endDate = new Date(this.booking.endDate);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}
