import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent {
  users: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  viewUser(userId: number): void {
    this.router.navigate(['/users', userId]);
  }

  editUser(userId: number): void {
    this.router.navigate(['/edit-user', userId]);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== userId);
          console.log('User deleted successfully.');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
