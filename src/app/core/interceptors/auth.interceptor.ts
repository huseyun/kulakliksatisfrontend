import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { ErrorMessageService } from '../services/error-message.service';
import { ErrorResponse } from '../../models/error.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly errorMessageService = inject(ErrorMessageService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    const authRequest = token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    // 401 → logout (mevcut davranış)
    if (error.status === 401) {
      this.authService.logout();
      return;
    }

    const errorMessage = this.extractErrorMessage(error);
    this.snackbarService.showError(errorMessage);
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    // Backend ErrorResponse body'sini parse et (yeni yapı: errorCode var)
    if (error.error?.statusCode !== undefined && error.error?.errorCode !== undefined) {
      const errorResponse = error.error as ErrorResponse;

      // Backend mesajını debug için logla (teknik detay)
      console.warn('[Backend Error]', {
        errorCode: errorResponse.errorCode,
        message: errorResponse.message
      });

      // Validation error'ları formatla
      if (errorResponse.validationErrors && errorResponse.validationErrors.length > 0) {
        const validationMessages = this.errorMessageService.formatValidationErrors(errorResponse.validationErrors);
        return `${errorResponse.message} — ${validationMessages}`;
      }

      // errorCode'a göre kullanıcı dostu mesaj
      return this.errorMessageService.getUserMessage(errorResponse.errorCode, errorResponse.message);
    }

    // Backend ErrorResponse formatına uymayan hatalar (fallback)
    if (error.status === 0) {
      return 'Sunucuya ulaşılamıyor. Bağlantınızı kontrol edin.';
    }
    if (error.status === 403) {
      return 'Bu işlem için yetkiniz yok.';
    }
    if (error.status === 404) {
      return 'İstenen kaynak bulunamadı.';
    }

    return 'Beklenmeyen bir hata oluştu.';
  }
}
