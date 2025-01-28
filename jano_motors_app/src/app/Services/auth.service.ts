import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserPswChange } from '../Interfaces/user';
import { UserInfoPost, UserInfo } from '../Interfaces/user-info';
import { jwtDecode } from 'jwt-decode';
import { UserDoc } from '../Interfaces/user-doc';
import { userInfo } from 'os';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface TokenPayload {
  id: number;
  role: string;
  isVerified: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {  

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/register`, user, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Login`, user,  {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  saveToken(token: string): void {
    if(isPlatformBrowser(this.platformId)) {
    localStorage.setItem('authToken', token);
    }
  }

  getLogedInUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      return decoded.id;
    } 

    return null;
  }

  getLoggedInUser(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<any>(`${environment.apiBaseUrl}/users/${this.getLogedInUserId()}`, {headers});
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      return decoded.role === 'admin';
    } 

    return false;
  }

  canAccessAdminRoutes(): boolean {
    return this.isAdmin();
  }

  getLoggedInUserIsVerified(): boolean | null {
    const token = this.getToken();
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      if (decoded.isVerified === 'True') {
        return true;
      }
    }

    return false;
  }

  getLoggedInUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: TokenPayload = jwtDecode(token);
      return decoded.role;
    } 

    return null;
  }

  updatePassword(user: UserPswChange): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/update-password?id=${user.id}&oldPassword=${user.oldPassword}&newPassword=${user.newPassword}`, user);
  }

  logout(): void {
    if(isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('authToken');
    }
  }

  private getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    } else {
      return null;
    }
  }
}
