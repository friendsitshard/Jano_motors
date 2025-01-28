import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { MyReservationsComponent } from "./my-reservations/my-reservations.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { UserInfo } from '../../Interfaces/user-info';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DashboardComponent, MyReservationsComponent, AccountSettingsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  public profImg: string = '/149071.png';

  public user!: any;
  public email: string = '';
  public isVerified: boolean = false;
  currentPage = 'dashboard';

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userService.getUserInfo(this.authService.getLogedInUserId()!).subscribe((data) => {
        console.log(data);
        this.user = data;
        if (this.user.profileImage) {
          this.user.profileImage = `data:image/jpeg;base64,${this.user.profileImage}`;
        }
      });
      this.authService.getLoggedInUser().subscribe((data) => {
        console.log(data)
        this.email = data.email;
      });
      this.isVerified = this.authService.getLoggedInUserIsVerified()!;
    }

    
  }

  changeTab(tab: string): void {
    this.currentPage = tab;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      this.authService.logout();
      window.location.href = '/';
    }
  }
}
