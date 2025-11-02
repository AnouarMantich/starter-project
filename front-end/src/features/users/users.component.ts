import { UserService } from './../../core/services/user-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: User | null = null;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 0): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error(err);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  openUserDetails(user: any): void {
    this.selectedUser = user;
  }

  closeModal(): void {
    this.selectedUser = null;
  }
  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
}
