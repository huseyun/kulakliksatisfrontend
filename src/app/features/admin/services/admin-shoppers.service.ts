import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  ShopperResponse,
  ShopperCreateRequest,
  ShopperUpdateRequest,
  ShopperDetailsUpdateRequest,
} from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminShoppersService {
  constructor(private http: HttpClient) {}

  getAllShoppers(): Observable<ShopperResponse[]> {
    return this.http.get<ShopperResponse[]>(`${environment.apiUrl}/admin/shoppers`);
  }

  getShopperById(id: number): Observable<ShopperResponse> {
    return this.http.get<ShopperResponse>(`${environment.apiUrl}/admin/shoppers/${id}`);
  }

  addShopper(request: ShopperCreateRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/admin/shoppers`, request);
  }

  updateShopper(shopperId: number, request: ShopperUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/shoppers/${shopperId}`, request);
  }

  updateShopperDetails(shopperId: number, request: ShopperDetailsUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/shoppers/${shopperId}/details`, request);
  }
}
