import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AdminUsersService } from '../services/admin-users.service';
import { UserResponse } from '../../../models/user.model';

export interface DeleteUserDialogData {
  user: UserResponse;
}

@Component({
  selector: 'app-delete-user-dialog',
  standalone: false,
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent {
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogData,
    private adminUsersService: AdminUsersService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.isLoading = true;

    this.adminUsersService.deleteUser(this.data.user.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        // Interceptor zaten Snackbar ile gösterdi
      }
    });
  }
}
