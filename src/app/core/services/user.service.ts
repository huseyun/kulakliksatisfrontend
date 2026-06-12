import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserPasswordUpdateRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  updatePassword(request: UserPasswordUpdateRequest): Observable<void> {
    return this.http.put<void>(this.apiUrl, request);
  }
}
