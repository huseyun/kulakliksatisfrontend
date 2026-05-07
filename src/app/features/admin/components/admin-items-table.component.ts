import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ItemSummaryResponse } from '../../../models/item.model';

@Component({
  selector: 'app-admin-items-table',
  standalone: false,
  templateUrl: './admin-items-table.component.html',
  styleUrls: ['./admin-items-table.component.css']
})
export class AdminItemsTableComponent implements OnChanges, AfterViewInit {
  @Input() items: ItemSummaryResponse[] = [];
  @Input() isLoading: boolean = false;
  
  @Output() delete = new EventEmitter<ItemSummaryResponse>();

  displayedColumns: string[] = ['thumbnail', 'id', 'title', 'price', 'actions'];
  dataSource = new MatTableDataSource<ItemSummaryResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items) {
      this.dataSource.data = this.items;
      // If items are loaded asynchronously, paginator might not be attached yet
      // but if it is, we don't need to reattach, MatTableDataSource handles it.
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onDeleteClick(item: ItemSummaryResponse): void {
    this.delete.emit(item);
  }
}
