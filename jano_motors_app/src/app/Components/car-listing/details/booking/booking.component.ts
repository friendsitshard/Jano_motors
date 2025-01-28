import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { CarsService } from '../../../../Services/cars.service';
import { AuthService } from '../../../../Services/auth.service';
import { CarInfo } from '../../../../Interfaces/car-info';
import { UserService } from '../../../../Services/user.service';
import { CommonModule } from '@angular/common';
import { Booking, BookingPost } from '../../../../Interfaces/booking';
import { BookingService } from '../../../../Services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements AfterViewInit, OnInit{
  @Input() sellectedCar!: CarInfo;
  @Input() modalVisible!: boolean;
  @Input() isDriver!: boolean;
  @Input() isAirport!: boolean;

  @Output() modalVisibleChange = new EventEmitter<boolean>();
  @Output() bookingCreated = new EventEmitter<boolean>();
  loggedInUser: any;
  bookingForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private carsService: CarsService,
    private authService: AuthService,
    private bookingService: BookingService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    console.log(this.sellectedCar.dayliPrice)
    this.userService.getUserInfo(this.authService.getLogedInUserId()!).subscribe({
      next: (data: any) => {
        this.loggedInUser = data;
        this.bookingForm.patchValue({
          fullName: this.loggedInUser.firstname + ' ' + this.loggedInUser.lastname,
          phone: this.loggedInUser.phoneNumber
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.authService.getLoggedInUser().subscribe({
      next: (data: any) => {
        const user = data;
        this.bookingForm.patchValue({
          email: user.email
        });
      },
      error: (error) => {
        console.error(error);
      }
    })

    console.log(this.sellectedCar)
    this.bookingForm = this.fb.group({
      userId: [this.authService.getLogedInUserId()?.toString(), Validators.required],
      carId: [this.sellectedCar.id?.toString(), Validators.required],
      fullName: [, Validators.required],
      email: [, [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      car: [{ value: this.sellectedCar.make + ' ' + this.sellectedCar.model, disabled: true }, Validators.required],
      pickupLocation: [{ value: this.isAirport ? 'Airport' : 'City', disabled: true }, Validators.required],
      pickupDate: ['', Validators.required],
      driver: [{ value: this.isDriver ? 'Yes' : 'No', disabled: true }, Validators.required],
      returnDate: ['', Validators.required],
      additionalNote: [''],
      totalPrice: ['', Validators.required],
      status: ['pending', Validators.required],  
    });

    console.log(this.bookingForm)
  }

  onSubmit() {
    this.getBookingDays();
    if (this.bookingForm.invalid) {
      console.log('invalid')
      this.errorMessage = 'Please fill all fields';
      this.bookingForm.markAllAsTouched();
      return;
    }
  
    const booking: BookingPost = {
      userId: this.bookingForm.value.userId,
      carId: this.bookingForm.value.carId,
      startDate: this.bookingForm.value.pickupDate,
      endDate: this.bookingForm.value.returnDate,
      totalPrice: this.bookingForm.value.totalPrice || 0,
      status: this.bookingForm.value.status,
    };
  
    const formData = new FormData();
    formData.append('userId', booking.userId.toString());
    formData.append('carId', booking.carId.toString());
    formData.append('startDate', booking.startDate);
    formData.append('endDate', booking.endDate);
    formData.append('totalPrice', booking.totalPrice.toString());
    formData.append('status', booking.status);
  
    this.bookingService.createBooking(formData).subscribe({
      next: (data) => {
        this.bookingCreated.emit(true);
        this.closeModal();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  closeModal() {
    this.modalVisible = false;
    this.modalVisibleChange.emit(this.modalVisible);
  }
  
  ngAfterViewInit() {
    flatpickr("#pickupDate", {
      enableTime: false,
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        this.bookingForm.patchValue({ pickupDate: dateStr });
        this.getBookingDays();
      }
    });

    flatpickr("#returnDate", {
      enableTime: false,
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        this.bookingForm.patchValue({ returnDate: dateStr });
        this.getBookingDays();
      }
    });

    this.getBookingDays();
  }

  getBookingDays(): number {
    const pickupDateStr = this.bookingForm.value.pickupDate;
    const returnDateStr = this.bookingForm.value.returnDate;
    if (pickupDateStr && returnDateStr) {
      const pickupDate = new Date(pickupDateStr);
      const returnDate = new Date(returnDateStr);
      const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime());
      let diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const dayliprice: number = this.sellectedCar.dayliPrice!;
      diffDays *= dayliprice;
      if (this.isDriver) {diffDays += this.sellectedCar.driverPrice!};
      if (this.isAirport) {diffDays += this.sellectedCar.airportPrice!};
      this.bookingForm.patchValue({ totalPrice: diffDays.toString() });
      
      return diffDays;
    } else {return 0};
  }
}
