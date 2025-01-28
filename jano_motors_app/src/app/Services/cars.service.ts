import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CarsService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  getAllCars(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any[]>(`${environment.carsUrl}`, { headers });
  }

  getCarById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.carsUrl}/${id}`, {headers});
  }

  getFilteredCars(filter: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<any>(`${environment.carsUrl}/filter`, filter, {headers});
  }

  getCarInfos(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any[]>(`${environment.carInfosUrl}`, {headers});
  }

  getCarInfoById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.carInfosUrl}/${id}`, {headers});
  }

  getCarDocs(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any[]>(`${environment.carDocsUrl}`, {headers});
  }

  getCarDocById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.carDocsUrl}/car/${id}`, {headers});
  }

  getCarDetailsById(id: number): Observable<any> {
    return forkJoin({
      car: this.getCarById(id),
      carInfo: this.getCarInfoById(id),
    }).pipe(
      map((responses: any) => {
        const car = responses.car;
        const carInfo = responses.carInfo;
        console.log(car)
        console.log(carInfo)
        return {
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          transmission: car.transmission,
          passengers: car.passengers,
          dayliPrice: car.dailyPrice,
          mainImage: `data:image/jpeg;base64,${car.mainImage}`,
          horsePower: carInfo.carInfo.horsePower,
          engineType: carInfo.carInfo.engineType,
          driverPrice: carInfo.carInfo.driverPrice,
          airportPrice: carInfo.carInfo.airportPrice,
        };
      })
    );
  }

  getCarImagesById(carId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return forkJoin({
      car: this.getCarById(carId),
      docs: this.getCarDocById(carId),
    }).pipe(
      map((responses: any) => {
        const car = responses.car;
        const docs = responses.docs;
        const mainImage = { image: `data:image/jpeg;base64,${car.mainImage}` };
        const images = [mainImage, ...docs.map((doc: any) => {
          return {
            image: `data:image/jpeg;base64,${doc.base64Image}`,
          };
        })];
        return { images };
      })
    );
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }
}
