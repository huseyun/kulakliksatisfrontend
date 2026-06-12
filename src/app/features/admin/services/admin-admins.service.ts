import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AdminResponse, UserCreateRequest, UserUpdateRequest } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAdminsService {
  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<AdminResponse[]> {
    return this.http.get<AdminResponse[]>(`${environment.apiUrl}/admin/admins`);
  }

  getAdminById(id: number): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${environment.apiUrl}/admin/admins/${id}`);
  }

  addAdmin(request: UserCreateRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/admin/admins`, request);
  }

  updateAdmin(adminId: number, request: UserUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/admins/${adminId}`, request);
  }
}
