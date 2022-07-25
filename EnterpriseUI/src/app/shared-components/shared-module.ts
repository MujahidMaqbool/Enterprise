import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateToDateFromComponent } from './app-datePicker/dateto.datefrom.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from 'src/app/directives/click.outside.directive';
import { NumberControlDirective } from 'src/app/directives/number.control.directive';
import { MaxDirective, MinDirective } from 'src/app/directives/min.max.validation.directive';
import { TwoDigitDecimalNumberDirective } from 'src/app/directives/Two.Digit.Decimal.Number.directive';
import { BranchSelectionComponent } from './branch-selection/branch.selection.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {AutofocusDirective} from 'src/app/directives/auto.focus.directive';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
  ]

})
export class SharedModule { }
