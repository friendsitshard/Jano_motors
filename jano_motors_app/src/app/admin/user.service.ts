import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../Services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { UserInfo } from '../Interfaces/user-info';
import { BookingService } from './booking.service';
import { UserDoc } from '../Interfaces/user-doc';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private bookingService: BookingService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  getAllUsers(): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.apiBaseUrl}/users`, {headers});
  }

  deleteUser(userId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete<void>(`${environment.apiBaseUrl}/users/${userId}`, {headers});
  }

  getUserInfo(id: number): Observable<UserInfo> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<UserInfo>(`${environment.userInfosUrl}/${id}`, {
      headers,
    });
  }

  getUserById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.apiBaseUrl}/users/${id}`, {headers});
  }

  getUserDocById(id: number): Observable<any> {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.getToken()}`,
        });
        return this.http.get<UserDoc[]>(`${environment.userDocsUrl}/user/${id}`, {
          headers,
        });
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }

  getUserDetailsById(id: number): Observable<any> {
    return forkJoin({
      user: this.getUserById(id),
      userDoc: this.getUserDocById(id),
      userInfo: this.getUserInfo(id),
    }).pipe(
      map((responses: any) => {
        const user = responses.user;
        const userDoc = responses.userDoc;
        const userInfo = responses.userInfo;

        return {
          id: user.id,
          email: user.email,
          role: user.roleId === 1 ? 'User' : 'Admin',
          isVerified: user.isVerified,
          IDBack: userDoc[0].imageBase64,
          IDFront: userDoc[1].imageBase64,
          LicenseBack: userDoc[2].imageBase64,
          LicenseFront: userDoc[3].imageBase64,
          PhoneNumber: userInfo.phoneNumber,
          ProfileImage: `data:image/jpeg;base64,${userInfo.profileImage}`,
          DateOfBirth: userInfo.dateOfBirth,
          Firstname: userInfo.firstname,
          Lastname: userInfo.lastname,
      }
      })
    )
  }
}