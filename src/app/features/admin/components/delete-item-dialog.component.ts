import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AdminItemsService } from '../services/admin-items.service';
import { ItemSummaryResponse } from '../../../models/item.model';
import { SnackbarService } from '../../../core/services/snackbar.service';

export interface DeleteItemDialogData {
  item: ItemSummaryResponse;
}

@Component({
  selector: 'app-delete-item-dialog',
  standalone: false,
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent {
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<DeleteItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteItemDialogData,
    private adminItemsService: AdminItemsService,
    private snackbarService: SnackbarService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.isLoading = true;

    this.adminItemsService.deleteItem(this.data.item.id).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Ürün başarıyla silindi.');
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        // Interceptor zaten Snackbar ile gösterdi
      }
    });
  }
}
