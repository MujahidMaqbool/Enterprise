import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { NavigationSetupComponent } from './navigation/setup.navigation.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { SharedPaginationModule } from '@app/shared-pagination-module/shared-pagination-module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationDialogSharedModule } from '@app/application-dialog-module/application-dialog-module';
import { RoleViewComponent } from './../shared-components/role-view/role-view.component';
import { RoleSaveComponent } from './role/role-save/role-save.component';
import { RoleSearchComponent } from './role/role-search/role-search.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogService } from '@app/services/mat.dialog.service';
import { RewardProgramDelete } from './reward-program/delete-Reward-Program-Dialog/reward.program.delete.dialog.component';
import { SearchRewardProgramComponent } from './reward-program/search/reward.program.search.component';
import { SaveRewardProgramComponent } from './reward-program/save/reward.program.save.component';
import { SaveAddExceptionComponent } from './reward-program/save/add-exception-dialog/add.exception.component';
import { SaveAddExceptionFormComponent } from './reward-program/save/add-form-exception/add.form-exception.save.component';
import { RewardViewComponent } from './reward-program/view/view.component';
import { DxHtmlEditorModule, DxValidatorModule } from 'devextreme-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RewardTemplateComponent } from './reward-program/save/reward-template/reward.template.component';
import { SharedModule } from '@app/shared-components/shared-module';
import { ApplicationPipesModule } from '@app/application-pipes/application.pipes.module';
import { SaveTaxComponent } from './taxes/save/save.tax.component';
import { SearchTaxComponent } from './taxes/search/search.taxes.component';
import { ViewTaxComponent } from './taxes/view/view.tax.component';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SetupRoutingModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatStepperModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatSelectModule,
    AngularCropperjsModule,
    InternationalPhoneNumberModule,
    SharedPaginationModule,
    ApplicationDialogSharedModule,
    MatDialogModule,
    DxHtmlEditorModule,
    DxValidatorModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    SharedModule,
    ApplicationPipesModule
  ],
  declarations: [
    NavigationSetupComponent,
    RoleViewComponent,
    RoleSaveComponent,
    RoleSearchComponent,
    RewardProgramDelete,
    SearchRewardProgramComponent,
    SaveRewardProgramComponent,
    SaveAddExceptionComponent,
    SaveAddExceptionFormComponent,
    RewardViewComponent,
    RewardTemplateComponent,
    SaveTaxComponent,
    SearchTaxComponent,
    ViewTaxComponent
  ],
  entryComponents: [
    SaveTaxComponent,
    ViewTaxComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    MatDialogService
  ]
})
export class SetupModule { }
