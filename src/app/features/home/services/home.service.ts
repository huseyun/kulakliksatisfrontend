import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ItemSummaryResponse } from '../../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  getRecommendedItems(): Observable<ItemSummaryResponse[]> {
    return this.http.get<ItemSummaryResponse[]>(`${this.apiUrl}/recommended`);
  }
}
