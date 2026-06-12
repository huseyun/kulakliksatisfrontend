import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { SellerResponse, SellerDetailedResponse, SellerCreateRequest, SellerUpdateRequest } from '../../../models/user.model';
import { ItemSummaryResponse } from '../../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSellersService {
  constructor(private http: HttpClient) {}

  getAllSellers(): Observable<SellerResponse[]> {
    return this.http.get<SellerResponse[]>(`${environment.apiUrl}/admin/sellers`);
  }

  getSellerById(id: number): Observable<SellerDetailedResponse> {
    return this.http.get<SellerDetailedResponse>(`${environment.apiUrl}/admin/sellers/${id}`);
  }

  addSeller(request: SellerCreateRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/admin/sellers`, request);
  }

  updateSeller(sellerId: number, request: SellerUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/sellers/${sellerId}`, request);
  }

  getItemsBySellerId(sellerId: number): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${environment.apiUrl}/admin/sellers/${sellerId}/items`);
  }
}
