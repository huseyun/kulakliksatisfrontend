import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ShopperResponse, ShopperDetailsUpdateRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ShopperService {
  private readonly apiUrl = `${environment.apiUrl}/shoppers`;

  constructor(private http: HttpClient) {}

  getCurrentShopper(): Observable<ShopperResponse> {
    return this.http.get<ShopperResponse>(`${this.apiUrl}/me`);
  }

  updateShopperDetails(request: ShopperDetailsUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me`, request);
  }
}
