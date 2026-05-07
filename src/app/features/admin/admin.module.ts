import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin.component';
import { AdminProductsComponent } from './components/admin-products.component';
import { AdminUsersComponent } from './components/admin-users.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog.component';
import { UpdateUserDialogComponent } from './components/update-user-dialog.component';
import { DeleteUserDialogComponent } from './components/delete-user-dialog.component';
import { DeleteItemDialogComponent } from './components/delete-item-dialog.component';
import { AdminItemsTableComponent } from './components/admin-items-table.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminProductsComponent,
    AdminUsersComponent,
    ChangePasswordDialogComponent,
    UpdateUserDialogComponent,
    DeleteUserDialogComponent,
    DeleteItemDialogComponent,
    AdminItemsTableComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class AdminModule { }
