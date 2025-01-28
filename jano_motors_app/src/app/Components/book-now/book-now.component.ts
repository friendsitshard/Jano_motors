import { Component, EventEmitter, Input, Output } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-book-now',
  standalone: true,
  imports: [],
  templateUrl: './book-now.component.html',
  styleUrl: './book-now.component.scss'
})
export class BookNowComponent {
  @Input() sellectedCar: any;
  @Input() modalVisible!: boolean;
  @Output() modalVisibleChange = new EventEmitter<boolean>();

  closeModal() {
    this.modalVisible = false;
    this.modalVisibleChange.emit(this.modalVisible);
  }
  
  ngAfterViewInit() {
    console.log('BookingComponent ngAfterViewInit');
    flatpickr("#pickupDate", {
      enableTime: false,
      dateFormat: "Y-m-d",
    });

    flatpickr("#returnDate", {
      enableTime: false,
      dateFormat: "Y-m-d",
    });
  }
}
