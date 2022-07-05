import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/customer.navigation.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApplicationDialogSharedModule } from '@app/application-dialog-module/application-dialog-module';
import { SharedPaginationModule } from '@app/shared-pagination-module/shared-pagination-module';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViewCustomerDetail } from './view/view.customer.detail.component';
import { SearchCustomerComponent } from './search/search.customer.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogService } from '@app/services/mat.dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '@app/shared-components/shared-module';
import { ApplicationPipesModule } from '@app/application-pipes/application.pipes.module';



@NgModule({
  declarations: [SearchCustomerComponent, NavigationComponent, 
    ViewCustomerDetail,
    ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    MatAutocompleteModule,
    MatTooltipModule,
    SharedPaginationModule,
    ApplicationDialogSharedModule,
    MatDialogModule,
    MatSelectModule ,
    MatDatepickerModule,
    SharedModule,
    ApplicationPipesModule
  ],

  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    MatDialogService
  ], 
  entryComponents: [
  ]
})
export class CustomerModule { }
