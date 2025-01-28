import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  createBooking(booking: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
    console.log(booking);
    const jsonPayload = {
      userId: booking.get('userId'),
      carId: booking.get('carId'),
      startDate: booking.get('startDate'),
      endDate: booking.get('endDate'),
      totalPrice: booking.get('totalPrice'),
      status: booking.get('status'),
    };

    console.log(jsonPayload);
    return this.http.post<any>(`${environment.bookingUrl}`, jsonPayload, {
      headers,
    });
  }

  getUsersBookings(id: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.http.get<any[]>(`${environment.bookingUrl}/user/${id}`, { headers });
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }
}
