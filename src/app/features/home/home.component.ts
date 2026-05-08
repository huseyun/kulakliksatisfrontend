import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HomeService } from './services/home.service';
import { ItemSummaryResponse } from '../../models/item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  recommendedItems: ItemSummaryResponse[] = [];
  isLoading: boolean = true;
  imageErrors: { [id: number]: boolean } = {};
  private subscription: Subscription = new Subscription();

  constructor(
    private homeService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('[HomeComponent] ngOnInit çalıştı.');
    this.fetchRecommendedItems();
  }

  fetchRecommendedItems(): void {
    console.log('[HomeComponent] fetchRecommendedItems istek atıyor...');
    this.isLoading = true;
    const sub = this.homeService.getRecommendedItems().subscribe({
      next: (items) => {
        console.log('[HomeComponent] Başarılı yanıt geldi:', items);
        this.recommendedItems = items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[HomeComponent] Hata oluştu:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        // Error is handled globally by AuthInterceptor + SnackbarService
      }
    });
    this.subscription.add(sub);
  }

  onImageError(itemId: number): void {
    this.imageErrors[itemId] = true;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
