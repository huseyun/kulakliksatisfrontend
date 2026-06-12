import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserResponse, UserPasswordUpdateRequest, UserUpdateRequest } from '../../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${environment.apiUrl}/admin/users`);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/admin/users/${id}`);
  }

  updatePassword(userId: number, request: UserPasswordUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/users/${userId}/password`, request);
  }

  updateUser(userId: number, request: UserUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/users/${userId}`, request);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/users/${userId}`);
  }
}
