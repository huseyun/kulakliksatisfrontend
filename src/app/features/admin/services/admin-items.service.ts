import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ItemSummaryResponse } from '../../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class AdminItemsService {
  constructor(private http: HttpClient) {}

  getAllItems(): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${environment.apiUrl}/admin/items`);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/items/${id}`);
  }
}
