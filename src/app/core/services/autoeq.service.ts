import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  EqualizeRequest,
  EqualizeResponse,
  AutoEQSearchResponse,
} from '../../models/autoeq.model';

@Injectable({
  providedIn: 'root'
})
export class AutoEQService {
  private readonly apiUrl = `${environment.apiUrl}/autoeq`;

  constructor(private http: HttpClient) {}

  equalize(request: EqualizeRequest): Observable<EqualizeResponse> {
    return this.http.post<EqualizeResponse>(`${this.apiUrl}/equalize`, request);
  }

  searchHeadphones(q?: string, limit?: number): Observable<AutoEQSearchResponse> {
    let params = new HttpParams();
    if (q !== undefined) params = params.set('q', q);
    if (limit !== undefined) params = params.set('limit', limit);
    return this.http.get<AutoEQSearchResponse>(`${this.apiUrl}/headphones`, { params });
  }
}
