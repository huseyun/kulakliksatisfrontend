import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { SellerResponse } from '../../../models/user.model';
import { ItemSummaryResponse } from '../../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSellersService {
  constructor(private http: HttpClient) {}

  getAllSellers(): Observable<SellerResponse[]> {
    return this.http.get<SellerResponse[]>(`${environment.apiUrl}/admin/sellers`);
  }

  getItemsBySellerId(sellerId: number): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${environment.apiUrl}/admin/sellers/${sellerId}/items`);
  }
}
