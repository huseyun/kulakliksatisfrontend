import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ItemResponse, ItemSummaryResponse } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly apiUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  getItemById(id: number): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(`${this.apiUrl}/${id}`);
  }

  searchItems(keyword: string): Observable<ItemSummaryResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ItemSummaryResponse[]>(`${this.apiUrl}/search`, { params });
  }
}
