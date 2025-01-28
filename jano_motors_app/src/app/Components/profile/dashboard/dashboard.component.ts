import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as users from '../../../../../public/json/users.json';
import { UserService } from '../../../Services/user.service';
import { AuthService } from '../../../Services/auth.service';
import { ProfileComponent } from '../profile.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  notifications: { newMessages?: any } = {};
  usersDocs = (users as any).default['userDocs'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private profileComponent: ProfileComponent
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.notifications = this.userService.getUserNotifications();
    }
  }

  fixAlert(text: string) {
    if (text === 'You have To Verify Your Profile') {
      this.profileComponent.changeTab('settings');
    }
  }

}
