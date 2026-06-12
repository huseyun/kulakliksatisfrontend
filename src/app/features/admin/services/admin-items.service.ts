import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ItemSummaryResponse, ItemUpdateRequest } from '../../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class AdminItemsService {
  constructor(private http: HttpClient) {}

  getAllItems(): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${environment.apiUrl}/admin/items`);
  }

  updateItem(id: number, request: ItemUpdateRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/admin/items/${id}`, request);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/items/${id}`);
  }
}
