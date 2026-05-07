import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AdminItemsService } from '../services/admin-items.service';
import { AdminSellersService } from '../services/admin-sellers.service';
import { ItemSummaryResponse } from '../../../models/item.model';
import { SellerResponse } from '../../../models/user.model';
import { DeleteItemDialogComponent } from './delete-item-dialog.component';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  // Tab 1 State
  allItems: ItemSummaryResponse[] = [];
  isAllItemsLoading: boolean = false;

  // Tab 2 State
  sellers: SellerResponse[] = [];
  selectedSellerId: number | null = null;
  sellerItems: ItemSummaryResponse[] = [];
  isSellersLoading: boolean = false;
  isSellerItemsLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private adminItemsService: AdminItemsService,
    private adminSellersService: AdminSellersService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllItems();
    this.loadSellers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- TAB 1 LOGIC ---
  private loadAllItems(): void {
    this.isAllItemsLoading = true;
    this.adminItemsService.getAllItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.allItems = items || [];
          this.isAllItemsLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isAllItemsLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onDeleteFromAll(item: ItemSummaryResponse): void {
    this.openDeleteDialog(item, () => this.loadAllItems());
  }

  // --- TAB 2 LOGIC ---
  private loadSellers(): void {
    this.isSellersLoading = true;
    this.adminSellersService.getAllSellers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sellers) => {
          this.sellers = sellers || [];
          this.isSellersLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isSellersLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSellerSelect(sellerId: number): void {
    this.selectedSellerId = sellerId;
    this.loadSellerItems(sellerId);
  }

  private loadSellerItems(sellerId: number): void {
    this.isSellerItemsLoading = true;
    this.adminSellersService.getItemsBySellerId(sellerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          // set API dönüyor olabilir, array'e çeviriyoruz
          this.sellerItems = Array.isArray(items) ? items : Array.from(items || []);
          this.isSellerItemsLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isSellerItemsLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onDeleteFromSeller(item: ItemSummaryResponse): void {
    this.openDeleteDialog(item, () => {
      if (this.selectedSellerId) {
        this.loadSellerItems(this.selectedSellerId);
      }
    });
  }

  // --- SHARED DIALOG LOGIC ---
  private openDeleteDialog(item: ItemSummaryResponse, onSuccess: () => void): void {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      width: '450px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        onSuccess();
        // Aynı zamanda diğer sekmedeki listeyi de güncel tutmak için Bütün Ürünler de yüklenmeli
        if (onSuccess !== this.loadAllItems) {
           this.loadAllItems();
        }
      }
    });
  }
}
