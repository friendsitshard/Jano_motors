import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";

@Component({
  selector: 'app-verified-users',
  standalone: true,
  imports: [AdminHeaderComponent],
  templateUrl: './verified-users.component.html',
  styleUrl: './verified-users.component.scss'
})
export class VerifiedUsersComponent {

}
