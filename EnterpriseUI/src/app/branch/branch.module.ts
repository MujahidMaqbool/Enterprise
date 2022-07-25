import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { branchNavigation } from './navigation/main/branch.navigation.component';
import { SetupModule } from 'src/app/setup/setup.module';
import { SharedPaginationModule } from 'src/app/shared-pagination-module/shared-pagination-module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationDialogSharedModule } from 'src/app/application-dialog-module/application-dialog-module';
import { BranchRoutingModule } from 'src/app/branch/branch-routing.module';
import { BranchesComponent } from './search/search.branches.component'
import { ViewBranchesComponent } from './view/view.branches.component'
import { ApplicationPipesModule } from 'src/app/application-pipes/application.pipes.module';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { DxDateBoxModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    InternationalPhoneNumberModule,
    SetupModule,
    MatDialogModule,
    SharedPaginationModule,
    ApplicationDialogSharedModule,
    ApplicationPipesModule,
    DxDateBoxModule
  ],
  declarations: [
    branchNavigation,
    BranchesComponent,
    ViewBranchesComponent,
  ],
  providers: [
    MatDialogService
  ],

})
export class BranchModule { }
