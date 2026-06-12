import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ItemService } from '../../core/services/item.service';
import { ItemResponse } from '../../models/item.model';
import { AutoeqPanelComponent } from './components/autoeq-panel/autoeq-panel.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AutoeqPanelComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly itemService = inject(ItemService);

  readonly item = signal<ItemResponse | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly imageError = signal(false);

  readonly mainImageUrl = computed(() => {
    const current = this.item();
    if (!current || current.images.length === 0) return null;
    const sorted = [...current.images].sort((a, b) => a.displayOrder - b.displayOrder);
    const main = sorted[0];
    const key = main.standardKey || main.originalKey;
    return `${environment.storageUrl}/${environment.storageBucket}/${key}`;
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    if (!id || isNaN(id)) {
      this.router.navigate(['/']);
      return;
    }
    this.itemService.getItemById(id).subscribe({
      next: (response) => {
        this.item.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Ürün yüklenemedi.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
