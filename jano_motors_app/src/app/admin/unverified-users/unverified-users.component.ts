import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";

@Component({
  selector: 'app-unverified-users',
  standalone: true,
  imports: [AdminHeaderComponent],
  templateUrl: './unverified-users.component.html',
  styleUrl: './unverified-users.component.scss'
})
export class UnverifiedUsersComponent {

}
