import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DeleteConfirmationComponent } from './delete-dialog/delete.confirmation.component';
import { DeleteSeriesComponent } from './delete-dialog/delete.series.component';
import { AlertConfirmationComponent } from './confirmation-dialog/alert.confirmation.component';
import { MatSelectModule } from '@angular/material/select';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { GenericAlertDialogComponent } from './generic-alert-dialog/generic.alert.dialog.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { EmailEditorComponent } from './email-editor/email.editor.component';
import { DxHtmlEditorModule, DxValidatorModule } from 'devextreme-angular';
import { DatePickerComponent } from './date-picker/date.picker.component';
import { ImageEditorPopupComponent } from './image-editor/image.editor.popup.component';
import { ImageEditorComponent } from './image-editor/image.editor.component';
import { ImageCaptureComponent } from './image-capture/image.capture.component';
import { WebcamModule } from 'ngx-webcam';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    AngularCropperjsModule,
    MatMomentDateModule,
    DxHtmlEditorModule,
    DxValidatorModule,
    WebcamModule
   ],

  providers:[],

  declarations: [
    DeleteConfirmationComponent,
    DeleteSeriesComponent,
    AlertConfirmationComponent,
    GenericAlertDialogComponent,
    EmailEditorComponent,
    DatePickerComponent,
    ImageEditorPopupComponent,
    ImageEditorComponent,
    ImageCaptureComponent
  ],

  exports: [
    DeleteConfirmationComponent,
    DeleteSeriesComponent,
    AlertConfirmationComponent,
    GenericAlertDialogComponent,
    EmailEditorComponent,
    DatePickerComponent,
    ImageEditorPopupComponent,
    ImageEditorComponent,
    ImageCaptureComponent
  ],
})
export class ApplicationDialogSharedModule { }
