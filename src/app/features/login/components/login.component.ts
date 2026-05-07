import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { ErrorMessageService } from '../../../core/services/error-message.service';
import { EErrorCode, ErrorResponse } from '../../../models/error.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  private readonly errorMessageService = inject(ErrorMessageService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    this.errorMessage = '';

    this.authService.login(username, password).subscribe({
      next: (response) => {
        // Token'ı decode et ve user info'yu kaydet
        const userInfo = this.authService.loginAndSave(response.token);
        
        // Role göre yönlendirme yapılabilir
        // Örnek: Admin ise admin paneline, shopper ise ana sayfaya
        if (userInfo.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error: HttpErrorResponse) => {
        // Interceptor zaten Snackbar ile gösterdi
        // Login sayfasında form altında da insani mesaj göster
        if (error.error?.statusCode !== undefined && error.error?.errorCode !== undefined) {
          const errorResponse = error.error as ErrorResponse;

          // Login için özel mesajlar
          if (errorResponse.errorCode === EErrorCode.USER_NOT_FOUND) {
            this.errorMessage = 'Kullanıcı adı veya şifre hatalı.';
          } else if (errorResponse.errorCode === EErrorCode.VALIDATION_ERROR) {
            this.errorMessage = 'Lütfen tüm alanları doldurun.';
          } else {
            this.errorMessage = this.errorMessageService.getUserMessage(
              errorResponse.errorCode,
              'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
            );
          }
        } else {
          this.errorMessage = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
        }
      }
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
