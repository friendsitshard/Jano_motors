import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDoc } from '../Interfaces/user-doc';
import { UserInfo, UserInfoPost } from '../Interfaces/user-info';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { BookingService } from './booking.service';

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

  getUserInfo(id: number): Observable<UserInfo> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<UserInfo>(`${environment.userInfosUrl}/${id}`, {
      headers,
    });
  }

  uploadUserInfos(userId: number, formData: FormData): Observable<any> {
    console.log('called uploadUserInfos');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<any>(
      `${environment.userInfosUrl}?userId=${userId}`,
      formData,
      { headers }
    );
  }

  updateUserInfo(id: number, formData: FormData): Observable<any> {
    const jsonPayload = {
      IDBack: this.convertBase64ToBlob(formData.get('IDBack') as string),
      IDFront: this.convertBase64ToBlob(formData.get('IDFront') as string),
      LicenseBack: this.convertBase64ToBlob(
        formData.get('LicenseBack') as string
      ),
      LicenseFront: this.convertBase64ToBlob(
        formData.get('LicenseFront') as string
      ),
      PhoneNumber: formData.get('PhoneNumber'),
      ProfileImage: this.convertBase64ToBlob(
        formData.get('ProfileImage') as string
      ),
      UserId: formData.get('UserId'),
      DateOfBirth: formData.get('DateOfBirth'),
      Firstname: formData.get('Firstname'),
      Lastname: formData.get('Lastname'),
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.put<any>(
      `${environment.userInfosUrl}/${id}`,
      jsonPayload,
      { headers }
    );
  }

  getUserDocs(id: number): Observable<UserDoc[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<UserDoc[]>(`${environment.userDocsUrl}/user/${id}`, {
      headers,
    });
  }

  getUserNotifications(): { newMessages: any[] } {
    const nottifications: { newMessages: any[] } = {
      newMessages: [],
    };

    this.bookingService
      .getUsersBookings(this.authService.getLogedInUserId()!)
      .subscribe({
        next: (data) => {
          data.map((booking) => {
            if (booking.status === 'pending') {
              nottifications.newMessages.push({
                text: `You Have to Finish Your Reservation (ID = ${booking.id})`,
                status: 'alert',
              });
            }
          });
        },
        error: (error) => {
          nottifications.newMessages.push({
            text: 'Error Getting Your Messages',
            status: 'alert',
          });
        },
      });

    if (!this.authService.getLoggedInUserIsVerified()) {
      nottifications.newMessages.push({
        text: 'You have To Verify Your Profile',
        status: 'alert',
      });
    }

    // if (nottifications.newMessages.length == 0) {
    //   nottifications.newMessages.push({
    //     text: 'You have No New Messages',
    //     status: 'active',
    //   });
    // }


    return nottifications;
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }

  private formDataToObject(formData: FormData): any {
    const obj: any = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  private convertBase64ToBlob(base64String: string): Blob {
    // Extract the content type and Base64 data
    const [contentType, base64Data] = base64String.split(';base64,');
    const byteCharacters = atob(base64Data); // Decode Base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Return Blob object
    return new Blob([byteArray], { type: contentType.split(':')[1] });
  }
}
