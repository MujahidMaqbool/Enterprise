import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeRoutingModule } from "./home-routing.module";

import { SlickCarouselModule } from "ngx-slick-carousel";

import { HomeComponent } from "./home.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ApplicationDialogSharedModule } from "@app/application-dialog-module/application-dialog-module";
import { InternationalPhoneNumberModule } from "ngx-international-phone-number";
import { SharedPaginationModule } from "@app/shared-pagination-module/shared-pagination-module";
import { SharedModule } from "@app/shared-components/shared-module";
import { MatDialogService } from "@app/services/mat.dialog.service";
import { ChangePasswordPopup } from "./change-password/change.password.popup.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatTooltipModule,
    SlickCarouselModule,
    MatPaginatorModule,
    SharedPaginationModule,
    InternationalPhoneNumberModule,
    ApplicationDialogSharedModule,
    SharedModule,
    
  ],
  declarations: [
    HomeComponent,
    ChangePasswordPopup
  ],

  entryComponents: [],

  providers: [
    MatDialogService
  ],
})
export class HomeModule {}
