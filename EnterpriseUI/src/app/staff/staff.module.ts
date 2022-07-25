import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { StaffRoutingModule } from 'src/app/staff/staff-routing.module';
import { SearchStaffComponent } from "src/app/staff/search/search.staff.component";
import { StaffNavigation } from './navigation/main/staff.navigation.component';
import { SetupModule } from 'src/app/setup/setup.module';
import { SharedPaginationModule } from 'src/app/shared-pagination-module/shared-pagination-module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationDialogSharedModule } from 'src/app/application-dialog-module/application-dialog-module';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { SharedModule } from 'src/app/shared-components/shared-module';
import { ViewStaffDetail } from './view-staff-detail/view.staff.detail.component';
import { AssignRolePopupComponent } from './assign-role/assign.role.component';
import { ApplicationPipesModule } from 'src/app/application-pipes/application.pipes.module';



@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    InternationalPhoneNumberModule,
    SetupModule,
    MatDialogModule,
    SharedPaginationModule,
    ApplicationDialogSharedModule,
    MatSelectModule,
    SharedModule,
    ApplicationPipesModule
  ],
  declarations: [
    StaffNavigation,
    SearchStaffComponent,
    ViewStaffDetail,
    AssignRolePopupComponent

  ],
  entryComponents: [
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    MatDialogService
  ]
})
export class StaffModule { }
