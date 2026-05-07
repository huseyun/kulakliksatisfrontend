import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AdminUsersService } from '../services/admin-users.service';
import { UserResponse } from '../../../models/user.model';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { UpdateUserDialogComponent } from './update-user-dialog.component';
import { DeleteUserDialogComponent } from './delete-user-dialog.component';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  selectedSubTab: number = 0;
  
  displayedColumns: string[] = ['id', 'username', 'email', 'userType', 'actions'];
  dataSource = new MatTableDataSource<UserResponse>();
  
  private destroy$ = new Subject<void>();

  constructor(
    private adminUsersService: AdminUsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAllUsers(): void {
    this.adminUsersService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: UserResponse[]) => {
          this.dataSource.data = users;
        },
        error: () => {
          // Interceptor zaten Snackbar ile gösterdi
        }
      });
  }

  onUpdateInfo(user: UserResponse): void {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User updated successfully, reload users
        this.loadAllUsers();
      }
    });
  }

  onChangePassword(userId: number, username: string): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      data: { userId, username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Password changed successfully, reload users
        this.loadAllUsers();
      }
    });
  }

  onDeleteUser(user: UserResponse): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '450px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAllUsers();
      }
    });
  }

  getUserTypes(user: UserResponse): string {
    return user.userType.map(ut => ut.userType).join(', ');
  }
}
