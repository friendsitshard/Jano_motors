import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  uploadCar(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<any>(environment.carsUrl, formData);
  }

  bulkUploadDocs(carId: number, files: File[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    const formData = new FormData();
    files.forEach(file => formData.append('docImages', file));
    return this.http.post(`${environment.carDocsUrl}/${carId}/bulk-upload`, formData, {headers});
  }

  getAllCars(): Observable<any[]> {
    return this.http.get<any[]>(environment.carsUrl);
  }

  getCarById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.carsUrl}/${id}`, {headers});
  }

  getCarInfoById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.carInfosUrl}/${id}`, {headers});
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
      carInfo: this.getCarInfoById(id)
      }).pipe(
      map((responses: any) => {
        const car = responses.car;
        const carInfo = responses.carInfo;
        console.log('car', car);
        console.log('carInfo', carInfo);
        return {
          id: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          transmission: car.transmission,
          passengers: car.passengers,
          dailyPrice: car.dailyPrice,
          mainImage: `data:image/jpeg;base64,${car.mainImage}`,
          horsePower: carInfo.carInfo.horsePower,
          engineType: carInfo.carInfo.engineType,
          driverPrice: carInfo.carInfo.driverPrice,
          airportPrice: carInfo.carInfo.airportPrice,
        };
      })
    );
  }

  deleteCar(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete<void>(`${environment.carsUrl}/${id}`, {headers});
  }

  updateCar(id: number, carData: FormData): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.put<void>(`${environment.carsUrl}/${id}`, carData, {headers});
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }
}
