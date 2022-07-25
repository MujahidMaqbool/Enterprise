import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Messages } from 'src/app/helper/config/app.messages';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { BranchSelectionComponent } from 'src/app/shared-components/branch-selection/branch.selection.component';
import { Tax } from 'src/app/product/models/tax.model';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { TaxApi } from 'src/app/helper/config/app.webapi';

@Component({
  selector: 'app-save-tax',
  templateUrl: './save.tax.component.html'
})
export class SaveTaxComponent implements OnInit {
  // #region Local Members
  @ViewChild(BranchSelectionComponent) branchSelectionRef: BranchSelectionComponent;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('taxInformationForm') taxInformationForm: NgForm;
  @Output()
  taxSaved = new EventEmitter<boolean>();
  BranchList: any[] = [];
  /* Messages */
  messages = Messages;
  /* Local Variables */
  pageTitle: string;
  showBranchValidation: boolean;
  zeroValueValidation: boolean;
  showPrevious: boolean = false;
  showContinue: boolean = true;
  isDisabledSaveButton: boolean = false;
  showSave: boolean;
  inValidTaxName: boolean;
  isFormSubmited: boolean;
  /** Model & Collection */
  tax: Tax = new Tax();
  // #endregion 
  constructor(public dialogRef: MatDialogRef<SaveTaxComponent>,
    private _matDialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public TaxID: any) { }

  ngOnInit(): void {
    if (this.TaxID > 0 && this.TaxID != null) {
      this.tax.TaxID = this.TaxID;
      this.getTaxID();
    } else {
      this.tax.TaxID = 0;
      this.getFundamental();
    }
  }
  // #region Events
  onClosePopup(): void {
    this.dialogRef.close();
  }
  // on previous button checks the stepper and show you buttons accordingly
  onPrevious() {
    this.stepper.previous();
    this.showContinue = true;
    this.showSave = false;
  }

  // on next button checks the stepper and show you buttons accordingly
  onNext() {
    if (this.stepper.selectedIndex === 0) {
      if (this.taxInformationForm.valid) {
        this.isFormSubmited = false;
        if (this.tax.TaxName == null || this.tax.TaxName == "") {
          this.inValidTaxName = true;
        } else {
          this.stepper.next();
          this.showPrevious = true;
          this.showSave = true;
          this.showContinue = false;
        }
      } else {
        this.isFormSubmited = true;
        this.taxInformationForm.form.markAllAsTouched();

      }
    }
  }
  // show the validation msg
  showValidation(event) {
    event = event.trim();
    if (event == "") {
      this.inValidTaxName = true;
    } else {
      this.inValidTaxName = false;
    }
  }
  onTaxValueChange() {
    this.zeroValueValidation = false;
    this.isFormSubmited = false;
    if (this.tax.TaxPercentage === 0 || this.tax.TaxPercentage > 100) {
      this.zeroValueValidation = true;
      this.taxInformationForm.form.controls['TaxPercentage'].setErrors({ 'incorrect': true });
    }
  }
  onSave() {
    if (this.branchSelectionRef.checkIsAnyBranchSelected()) {
      this.isDisabledSaveButton = true;
      let BranchList = this.branchSelectionRef.branchList;
      this.tax.BranchList = BranchList;
      this.tax.HasBranchPermission = this.branchSelectionRef.HasBranchPermission;
      let param = JSON.parse(JSON.stringify(this.tax))
      this._httpService.save(TaxApi.saveTax, param).subscribe((respose) => {
        if (respose.MessageCode > 0) {
          this.taxSaved.emit(true);
          this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Tax"));
          this.onClosePopup();
        } else {
          if (respose.MessageCode === -145) {
            this.isDisabledSaveButton = false;
            this._messageService.showErrorMessage(respose.MessageText);
          } else {
            this.isDisabledSaveButton = false;
            this._messageService.showErrorMessage(respose.MessageText);
          }
        }
      }, error => {
        this.isDisabledSaveButton = false;
        this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "Tax"));
      });
    }

  }
  // check isIncluded branch or not toggle
  onIsIncludedToggle(branchID: any, index: any) {
    this.tax.BranchList.forEach(branch => {
      if (branch.BranchID == branchID && !branch.IsIncluded) {
        branch.IsActive = false;
      }
    })
    this.showBranchValidation = false;
  }

  // #endregion
  //#region  Method
  // get Tax by id for edit
  getTaxID() {
    let param = TaxApi.getDetailByID + this.tax.TaxID
    this._httpService.get(param).subscribe((respose) => {
      if (respose.MessageCode > 0) {
        this.tax = respose.Result;

      } else {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Tax"));
      }
    });
  }
  // get fundamental for save
  getFundamental() {
    this._httpService.get(TaxApi.getFundamental).subscribe((respose) => {
      this.tax.BranchList = respose.Result;
      this.tax.BranchList.forEach(element => {
        element.IsActive = true;
        element.IsIncluded = true;
      });
    });

  }
}
