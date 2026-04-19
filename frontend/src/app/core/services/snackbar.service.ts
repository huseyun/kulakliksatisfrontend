import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Merkezi bildirim service'i.
 * Tüm hata, başarı ve uyarı mesajlarını tutarlı şekilde gösterir.
 */
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  };

  /**
   * Hata mesajı gösterir (kırmızı arka plan)
   */
  showError(message: string, duration: number = 5000): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error']
    };
    this.snackBar.open(message, 'Kapat', config);
  }

  /**
   * Başarı mesajı gösterir (yeşil arka plan)
   */
  showSuccess(message: string, duration: number = 3000): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success']
    };
    this.snackBar.open(message, 'Tamam', config);
  }

  /**
   * Uyarı mesajı gösterir (turuncu arka plan)
   */
  showWarning(message: string, duration: number = 4000): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning']
    };
    this.snackBar.open(message, 'Tamam', config);
  }
}
