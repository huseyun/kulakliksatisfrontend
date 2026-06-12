import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, JwtPayload, UserInfo, UserRole } from '../../models/auth.model';
import { ShopperCreateRequest, ShopperResponse } from '../../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'userInfo';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Backend'e login isteği gönderir
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginRequest);
  }

  register(request: ShopperCreateRequest): Observable<ShopperResponse> {
    return this.http.post<ShopperResponse>(`${environment.apiUrl}/auth/register`, request);
  }

  /**
   * Login başarılı olduğunda token ve user info'yu kaydeder
   */
  loginAndSave(token: string): UserInfo {
    this.setToken(token);
    const decoded = this.decodeToken();
    if (!decoded) {
      throw new Error('Token decode edilemedi');
    }
    
    const userInfo: UserInfo = {
      username: decoded.sub,
      roles: decoded.roles,
      isAdmin: decoded.roles.includes(UserRole.ADMIN),
      isShopper: decoded.roles.includes(UserRole.SHOPPER),
      isSeller: decoded.roles.includes(UserRole.SELLER)
    };
    
    this.setUserInfo(userInfo);
    return userInfo;
  }

  /**
   * Kullanıcıyı logout yapar ve token/userInfo temizler
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Token'ı localStorage'a kaydeder
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Token'ı localStorage'dan okur
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * JWT token'ı decode edip JwtPayload döner
   * Token geçersiz veya bozuksa null döner
   */
  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Token'ın süresi dolmuş mu kontrol et
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        this.logout();
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Token decode hatası:', error);
      return null;
    }
  }

  /**
   * Kullanıcı bilgilerini UserInfo olarak döner
   * Token'dan rolleri hesaplar
   */
  getUserInfo(): UserInfo | null {
    // Önce localStorage'da var mı kontrol et
    const cachedUserInfo = localStorage.getItem(this.USER_KEY);
    if (cachedUserInfo) {
      try {
        return JSON.parse(cachedUserInfo) as UserInfo;
      } catch {
        // Parse hatası olursa token'dan yeniden hesapla
      }
    }

    // Token'dan hesapla
    const decoded = this.decodeToken();
    if (!decoded) {
      return null;
    }

    const userInfo: UserInfo = {
      username: decoded.sub,
      roles: decoded.roles,
      isAdmin: decoded.roles.includes(UserRole.ADMIN),
      isShopper: decoded.roles.includes(UserRole.SHOPPER),
      isSeller: decoded.roles.includes(UserRole.SELLER)
    };

    // Cache'le
    this.setUserInfo(userInfo);
    return userInfo;
  }

  /**
   * UserInfo'yı localStorage'a kaydeder
   */
  private setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
  }

  /**
   * Kullanıcının belirtilen role sahip olup olmadığını kontrol eder
   */
  hasRole(role: UserRole): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.roles.includes(role) ?? false;
  }

  /**
   * Kullanıcının belirtilen rollerden en az birine sahip olup olmadığını kontrol eder
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      return false;
    }
    return roles.some(role => userInfo.roles.includes(role));
  }

  /**
   * Kullanıcının belirtilen tüm rollerine sahip olup olmadığını kontrol eder
   */
  hasAllRoles(roles: UserRole[]): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      return false;
    }
    return roles.every(role => userInfo.roles.includes(role));
  }

  /**
   * Kullanıcının login olup olmadığını kontrol eder
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || token.trim() === '') {
      return false;
    }

    // Token süresi dolmuş mu kontrol et
    const decoded = this.decodeToken();
    return decoded !== null;
  }

  /**
   * Kullanıcının admin olup olmadığını kontrol eder
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  /**
   * Kullanıcının shopper olup olmadığını kontrol eder
   */
  isShopper(): boolean {
    return this.hasRole(UserRole.SHOPPER);
  }

  /**
   * Kullanıcının seller olup olmadığını kontrol eder
   */
  isSeller(): boolean {
    return this.hasRole(UserRole.SELLER);
  }
}
