import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AdminUsersService } from '../services/admin-users.service';
import { UserUpdateRequest, UserResponse } from '../../../models/user.model';

export interface UpdateUserDialogData {
  user: UserResponse;
}

@Component({
  selector: 'app-update-user-dialog',
  standalone: false,
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.css']
})
export class UpdateUserDialogComponent {
  userForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateUserDialogData,
    private adminUsersService: AdminUsersService
  ) {
    this.userForm = this.fb.group({
      username: [data.user.username, [Validators.required]],
      email: [data.user.email, [Validators.required, Validators.email]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;
    const request: UserUpdateRequest = {
      username: this.userForm.value.username,
      email: this.userForm.value.email
    };

    this.adminUsersService.updateUser(this.data.user.id, request).subscribe({
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
