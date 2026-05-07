import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models/auth.model';

/**
 * Route data interface for RoleGuard
 */
export interface RoleGuardData {
  roles: UserRole[];
}

/**
 * Rol bazlı route koruma guard'ı
 * Kullanıcının belirtilen rollerden en az birine sahip olup olmadığını kontrol eder
 *
 * Kullanım:
 * {
 *   path: 'admin',
 *   canActivate: [AuthGuard, RoleGuard],
 *   data: { roles: [UserRole.ADMIN] }
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Önce kullanıcı login olmuş mu kontrol et
    if (!this.authService.isLoggedIn()) {
      return this.router.navigate(['/login']);
    }

    // Route data'sından gerekli rolleri al
    const requiredRoles = route.data['roles'] as UserRole[] | undefined;

    // Eğer rol belirtilmemişse, sadece login kontrolü yeterli
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Kullanıcının gerekli rollerden birine sahip olup olmadığını kontrol et
    const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);

    if (hasRequiredRole) {
      return true;
    }

    // Rol yetkisi yoksa home'a redirect et
    return this.router.navigate(['/']);
  }
}
