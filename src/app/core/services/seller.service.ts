import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SellerDetailsUpdateRequest } from '../../models/user.model';
import { ItemSummaryResponse } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly apiUrl = `${environment.apiUrl}/sellers`;

  constructor(private http: HttpClient) {}

  getMyItems(): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${this.apiUrl}/me/items`);
  }

  updateSellerDetails(request: SellerDetailsUpdateRequest): Observable<void> {
    return this.http.put<void>(this.apiUrl, request);
  }
}
