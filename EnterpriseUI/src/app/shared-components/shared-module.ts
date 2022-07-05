import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateToDateFromComponent } from './app-datePicker/dateto.datefrom.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '@app/directives/click.outside.directive';
import { NumberControlDirective } from '@app/directives/number.control.directive';
import { MaxDirective, MinDirective } from '@app/directives/min.max.validation.directive';
import { TwoDigitDecimalNumberDirective } from '@app/directives/Two.Digit.Decimal.Number.directive';
import { BranchSelectionComponent } from './branch-selection/branch.selection.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {AutofocusDirective} from '@app/directives/auto.focus.directive';

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    FormsModule,
    MatSlideToggleModule,
  ],

  declarations: [
    DateToDateFromComponent,
    BranchSelectionComponent,
    ClickOutsideDirective,
    NumberControlDirective,
    MaxDirective,
    MinDirective,
    TwoDigitDecimalNumberDirective,
    AutofocusDirective
  ],

  exports: [
    BranchSelectionComponent,
    DateToDateFromComponent,
    ClickOutsideDirective,
    TwoDigitDecimalNumberDirective,
    NumberControlDirective,
    MaxDirective,
    MinDirective,
    AutofocusDirective
  ],
})
export class SharedModule { }
