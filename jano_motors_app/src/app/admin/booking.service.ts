import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  getAllBookings(): Observable<any[]> {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        });
    return this.http.get<any[]>(`${environment.bookingUrl}`, {headers});
  }

  getBookingById(bookingId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(`${environment.bookingUrl}/${bookingId}`, {headers});
  }

  uploadInvoice(bookingId: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<any>(`${environment.bookingUrl}/${bookingId}/upload-invoice `, formData, {
      headers,
    });
  }

  getBookingDocs(bookingId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.bookingUrl}/${bookingId}/payment-docs`, {headers}).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of([]); // Return an empty array if payment-docs endpoint returns 404
        } else {
          throw error;
        }
      })
    );
  }

  getBookingDetails(id: number, car: any) {
    return forkJoin({
      booking: this.getBookingById(id),
      docs: this.getBookingDocs(id)
    }).pipe(
      map((data: any) => {
        const booking = data.booking;
        const docs = data.docs;
        const moreInfo = this.getBookingMoreInfo(booking, car, docs);
        return {
          id: booking.id,
          userId: booking.userId,
          carId: booking.carId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          status: booking.status,
          bookingDays: moreInfo.bookingDays,
          airportService: moreInfo.airportService,
          driverService: moreInfo.driverService,
          invoice: moreInfo?.invoice,
        };
      })
    );
  }

  getBookingMoreInfo(booking: any, car: any, docs: any) {
    const baseTotalPrice = booking.totalPrice;
    const bookingDays = this.getBookingDays(booking.startDate, booking.endDate);
    const totalPrice = booking.dayliPrice * bookingDays;

    let invoice = '';
    if (docs && docs.length > 0) {
      invoice = `data:image/jpeg;base64,${docs[0].imageBase64}`;
    }

    let airportService = false;
    let driverService = false;

    if (totalPrice !== baseTotalPrice) {
      const additionalPrice = baseTotalPrice - totalPrice;

      if (additionalPrice > 0) {
        if (additionalPrice === car.airportPrice) {
          airportService = true;
        } else if (additionalPrice === car.driverPrice) {
          driverService = true;
        } else if (additionalPrice === (car.airportPrice + car.driverPrice)) {
          airportService = true;
          driverService = true;
        }
      }
    }

    return {
      bookingDays: bookingDays,
      airportService: airportService,
      driverService: driverService,
      invoice: invoice,
    };
  }

  getBookingDays(STD: string, END: string) {
    const startDate = new Date(STD);
    const endDate = new Date(END);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  changeBookingStatus(bookingId: number, status: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
    console.log(status);
    return this.http.patch(`${environment.bookingUrl}/${bookingId}/change-status`, JSON.stringify(status), { headers });
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }
}
