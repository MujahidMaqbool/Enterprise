// #region Imports

/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from "rxjs";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

/********************* Material:Refference ********************/
import { MatStepper } from '@angular/material/stepper';

/**********************  Components *********************/
import { BranchSelectionComponent } from 'src/app/shared-components/branch-selection/branch.selection.component';

/**********************  Configurations *********************/
import { SupplierValidation, WizardforSupplier } from 'src/app/helper/config/app.enums';
import { SupplierApi } from 'src/app/helper/config/app.webapi';
import { Messages } from 'src/app/helper/config/app.messages';

/********************** Services & Models *********************/
import { ApiResponse, CompanyInformation, DD_Branch } from 'src/app/models/common.model';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { Branches, SupplierViewModel } from '../../models/supplier.models';

// #region end



@Component({
  selector: "app-save-supplier",
  templateUrl: "./save.supplier.component.html",
 
})
export class SaveSupplierComponent implements OnInit {
  @ViewChild("SupplierInformation") supplierInformation: NgForm;
  @ViewChild("branchSelectionRef") branchSelectionRef: BranchSelectionComponent;
  @ViewChild("stepper") stepper: MatStepper;

  /***********Messages*********/
  messages = Messages;

  /***********Objects*********/
  supplierObj: SupplierViewModel = new SupplierViewModel();
  supplierID: number = 0;
  branchList: Branches[];
  countryList: [];
  titleList = [];
  /*********** Local *******************/
  defaultCountry: string;
  showError: boolean = false;
  showSave: boolean = false;
  showContinue: boolean = true;
  showPrevious: boolean = false;
  showBranchValidation: boolean = false;
  isSaveClicked: boolean = false;
  currentBranchSubscription: SubscriptionLike;

  errorMsg: string = "";

  supplierValidationENUM = SupplierValidation;
  constructor(
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,
    private _router: Router,
    private route: ActivatedRoute
  ) {
    // this.getCompany();
    this.getSaveFundamentals();
  }

  ngOnInit(): void {
    // here we get the id from route
    this.route.params.subscribe((params: Params) => {
      let supplierID = params["ID"];
      this.supplierID = Number(supplierID);
      if (this.supplierID > 0) {
        this.getSupplierByID();
      }
    });
    this.getDefaultBranch();
  }

  ngOnDestroy() {
    this.currentBranchSubscription.unsubscribe();
  }

  // #region method start

  // get data according to selected branch

  async getDefaultBranch() {
    this.currentBranchSubscription =
      this._dataSharingService.currentBranch.subscribe((branch: DD_Branch) => {
        if (branch.BranchID && branch.hasOwnProperty("Currency")) {
          this.defaultCountry = branch.Currency.toLowerCase().substring(
            0,
            branch.Currency.length - 1
          );
        }
      });
  }


  // get the supplier by ID
  getSupplierByID() {
    this._httpService
      .get(SupplierApi.getSupplierByID + this.supplierID)
      .subscribe(
        (response: ApiResponse) => {
          if (response.MessageCode > 0) {
            this.supplierObj = response.Result;
            this.branchList = [];
            this.branchList = this.supplierObj.SupplierBranchVM;
          } else {
            this._messageService.showErrorMessage(
              this.messages.Error.Get_Error.replace("{0}", "Supplier")
            );
          }
        },
        (error) => {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace("{0}", "Supplier")
          );
        }
      );
  }

  // stepper next button
  onNext(supplierInformation: NgForm) {
    if (this.stepper.selectedIndex === WizardforSupplier.SupplierInformation) {
      if (this.supplierInformation.valid) {
        this.showError = false;
        this.showPrevious = true;
        this.showContinue = false;
        this.showSave = true;
        this.stepper.next();
      } else {
        this.getErrorMessage(supplierInformation);
      }
    } else if (
      this.stepper.selectedIndex === WizardforSupplier.SupplierBranch
    ) {
    }
  }

  // stepper previous button
  onPrevious() {
    this.stepper.previous();
    if (this.stepper.selectedIndex === WizardforSupplier.SupplierInformation) {
      this.showPrevious = false;
      this.showSave = false;
      this.showContinue = true;
    }
  }

  // save the supplier information
  onSave() {
    if (this.branchSelectionRef.checkIsAnyBranchSelected()) {
      this.supplierObj.SupplierBranchVM = this.branchSelectionRef.branchList;
      this.supplierObj.HasBranchPermission = this.branchSelectionRef.HasBranchPermission;
      this.isSaveClicked = true;
      this._httpService
        .save(SupplierApi.saveSupplier, this.supplierObj)
        .subscribe(
          (response: ApiResponse) => {
            if (response.MessageCode > 0) {
              this._messageService.showSuccessMessage(
                this.messages.Success.Save_Success.replace("{0}", "Supplier")
              );
              this._router.navigate(["/product/suppliers"]);
            } else {
              this._messageService.showErrorMessage(
                this.messages.Error.Save_Error.replace("{0}", "Supplier")
              );
            }
          },
          (error) => {
            this._messageService.showErrorMessage(
              this.messages.Error.Get_Error.replace("{0}", "Supplier")
            );
          }
        );
    }
  }

  // here we check that nobranch is selected then show the validation
  checkIsAnyBranchSelected() {
    let isBranchSelected = this.branchList.find((i) => i.IsIncluded == true);
    if (isBranchSelected) {
      return true;
    } else {
      this.showBranchValidation = true;
      return false;
    }
  }

  // get the fundamentals list
  getSaveFundamentals() {
    this._httpService.get(SupplierApi.getfundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          if (this.supplierID == 0) {
            this.branchList = response.Result.BranchList;

            this.branchList?.forEach((item) => {
              item.IsActive = true;
              item.IsIncluded = true;
            });
          }
          this.countryList = response.Result.CountryList;
          this.titleList = response.Result.TitleList;
        } else {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace("{0}", "Supplier")
          );
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Supplier")
        );
      }
    );
  }

  // show the validation msg
  showValidation(event, supplierInformation: NgForm, supplierValidationType) {
    event = event.trim();
    if (supplierValidationType == this.supplierValidationENUM.SupplierName) {
      if (event == "") {
        this.showError = true;
        this.errorMsg = Messages.Validation.Info_Required;
      } else {
        this.showError = false;
        this.errorMsg = "";
      }
    } else if ((supplierValidationType = this.supplierValidationENUM.Email)) {
      if (supplierInformation.controls.email?.errors) {
        this.errorMsg = Messages.Validation.Email_Invalid;
      } else {
        this.errorMsg = "";
      }
    }
  }

  // change the supplier toggle in branch list
  supplierToggleChange(event, branchData: Branches) {
    if (event.checked) {
      this.showBranchValidation = false;
    }
    this.branchList.forEach((item) => {
      if (item.BranchID == branchData.BranchID) {
        item.IsActive = event.checked;
      }
    });
  }

  // error showing
  getErrorMessage(supplierInformation: NgForm) {
    if (supplierInformation.invalid) {
      if (supplierInformation.controls.supplierName?.errors) {
        this.errorMsg = Messages.Validation.Info_Required;
        this.showError = true;
      } else if (supplierInformation.controls.email?.errors) {
        this.errorMsg = Messages.Validation.Email_Invalid;
      } else {
        this.errorMsg = Messages.Validation.Phone_Invalid;
      }
    } else {
      this.errorMsg = "";
    }
  }

  // #region method end
}
