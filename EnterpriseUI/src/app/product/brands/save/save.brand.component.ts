import { Component, OnInit, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { WizardforSaveBrand } from '@app/helper/config/app.enums';
import { NgForm } from '@angular/forms';
import { SaveBrand, BranchList, ProductCategoryList } from '../brand.models';
import { HttpService } from '@app/services/app.http.service';
import { BrandApi } from '@app/helper/config/app.webapi';
import { MessageService } from '@app/services/app.message.service';
import { Messages } from '@app/helper/config/app.messages';
import { ApiResponse } from '@app/models/common.model';
import { MatOption } from '@angular/material/core';
import { BranchSelectionComponent } from '@app/shared-components/branch-selection/branch.selection.component';
import { TrimPipe } from '@app/application-pipes/trim';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: "app-save-brand",
  templateUrl: "./save.brand.component.html",
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
}]
})
export class SaveBrandComponent implements OnInit {
  /*********** region Local Members ****/
  @ViewChild("SaveBrandData") saveBrandData: NgForm;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('allSelectedProductCategory') private allSelectedProductCategory: MatOption;
  @ViewChild('branchSelectionRef') branchSelectionRef: BranchSelectionComponent;
  @Output() isSaved = new EventEmitter<boolean>();

  messages = Messages;
  brandSaveModel: SaveBrand = new SaveBrand();
  branchList: BranchList[];
  productCategoryList: ProductCategoryList[];
  //Local
  showPrevious: boolean;
  showContinue: boolean = true;
  showError: boolean = false;
  showSave: boolean = false;
  showBranchValidation: boolean = false;
  inValidBrandName: boolean = false;
  inValidProductCategory: boolean = false;
  addedproductCategoryList: any[] = [];
  selectedProductCategoryList: any[] = [];
  isDisabledSaveButton: boolean = false;

  constructor(
    private _dialog: MatDialogRef<SaveBrandComponent>,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _trimString: TrimPipe,
    @Inject(MAT_DIALOG_DATA) public brandID: any
  ) { }


  ngOnInit(): void {
    this.getFundamental();
  }

  toggleAllCatSelection() {
    this.inValidProductCategory = false;
    this.selectedProductCategoryList = [];

    if (this.allSelectedProductCategory.selected) {
        this.productCategoryList.forEach(category => {
            this.selectedProductCategoryList.push(category);
        });
        setTimeout(() => {
            this.allSelectedProductCategory.select();
        }, 100);
    }
    this.isDisabledSaveButton = false;
  }

  togglePerCat(all) {
    this.inValidProductCategory = false;
    if (this.allSelectedProductCategory && this.allSelectedProductCategory.selected) {
        this.allSelectedProductCategory.deselect();
    }
    if (this.productCategoryList.length == this.selectedProductCategoryList.length && this.productCategoryList.length > 1) {
        this.allSelectedProductCategory.select();
    }
    this.isDisabledSaveButton = false;
  }
 
  trimName() {
    this.brandSaveModel.BrandName = this._trimString.transform(
      this.brandSaveModel.BrandName
    );
  }

  getFundamental() {
    this._httpService.get(BrandApi.getBrandSearchFundamentals).subscribe((respose) => {
      // this.brandSaveModel = respose.Result;
      this.productCategoryList = respose.Result.ProductCategoryList;
      this.branchList = respose.Result.BranchList;
      this.branchList?.forEach((item)=>{
        item.IsActive = true;
        item.IsIncluded = true;
      });

      if (this.brandID > 0 && this.brandID != null) {
        this.brandSaveModel.BrandID = this.brandID;
        this.getBrandByID();
      }

    });
  }

  // change the Brand toggle in branch list
  brandToggleChange(event, branchData: BranchList) {
    if(event.checked){
      this.showBranchValidation = false;
    }
    this.branchList.forEach((item) => {
      if (item.BranchID == branchData.BranchID) {
        item.IsActive = event.checked;
      }
    });
  }

  // show the validation msg
  showValidation(event) {
    event = event.trim();
    if (event == "") {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  // // here we check that nobranch is selected then show the validation
  // checkIsAnyBranchSelected(){
  //   let isBranchSelected = this.branchList.find( i => i.IsIncluded == true);
  //   if(isBranchSelected){
  //     return true;
  //   }
  //   else{
  //     this.showBranchValidation = true;
  //     return false;
  //   }
  // }

// Set Product Category
setProductCategory() {
  this.selectedProductCategoryList = [];
  if (this.productCategoryList && this.productCategoryList.length > 0) {
      this.addedproductCategoryList.forEach((categoryList) => {
          let result = this.productCategoryList.find(i => i.ProductCategoryID == categoryList.ProductCategoryID);
          if (result) {
              this.selectedProductCategoryList.push(result);
          }
      });
  }
  if (this.productCategoryList && this.productCategoryList.length > 0 && this.selectedProductCategoryList &&
    this.selectedProductCategoryList.length > 0 && this.selectedProductCategoryList.length == this.productCategoryList.length) {
      setTimeout(() => {
          this.allSelectedProductCategory.select();
      }, 100);
  }
}

// on previous button checks the stepper and show you buttons accordingly
onPrevious() {
  this.stepper.previous();
  this.showContinue = true;
  this.showSave = false;
  this.showPrevious = false;
}

// on next button checks the stepper and show you buttons accordingly
onNext() {
  if (this.stepper.selectedIndex === WizardforSaveBrand.BrandInformation) {
    //if (this.saveBrandData.valid) {
      if (this.brandSaveModel.BrandName == null || this.brandSaveModel.BrandName == "" || this.brandSaveModel.BrandName == undefined ||
          this.selectedProductCategoryList == null || this.selectedProductCategoryList == undefined || this.selectedProductCategoryList.length == 0) {

        if(this.brandSaveModel.BrandName == null || this.brandSaveModel.BrandName == "" || this.brandSaveModel.BrandName == undefined){
          this.inValidBrandName = true;
          this.showError = true;
        }

        if(this.selectedProductCategoryList == null || this.selectedProductCategoryList == undefined || this.selectedProductCategoryList.length == 0){
          this.inValidProductCategory = true;
          this.showError = true;
        }

      } else {
        this.stepper.next();
        console.log(this.brandSaveModel);
        this.showPrevious = true;
        this.showSave = true;
        this.showContinue = false;
        this.showError = false;
      }
    // } else {
    //   this.inValidBrandName = true;
    //   this.inValidProductCategory = true;
    // }
  }
}

// On Save Brand
onSave() {
  this.isDisabledSaveButton = true;
  if(this.branchSelectionRef.checkIsAnyBranchSelected()){
    this.brandSaveModel.BranchList = this.branchSelectionRef.branchList;
    this.brandSaveModel.HasBranchPermission = this.branchSelectionRef.HasBranchPermission;

  if (this.allSelectedProductCategory.selected) {
    this.selectedProductCategoryList = this.selectedProductCategoryList.slice(1);
  }

  this.brandSaveModel.ProductCategoryList = this.selectedProductCategoryList;
  this._httpService.save(BrandApi.saveBrand, this.brandSaveModel).subscribe((respose) => {
    if (respose.MessageCode > 0) {
      this.isSaved.emit(true);
      this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Brand"));
      this.onCloseDialog();
    } else {
      this.isDisabledSaveButton = false;
      this._messageService.showErrorMessage(respose.MessageText);
    }
  });
}
}


// Get Brand By ID
getBrandByID() {
  this._httpService.get(BrandApi.getBrandByID + this.brandID).subscribe(
    (response: ApiResponse) => {
      if (response.MessageCode > 0) {
          this.brandSaveModel = response.Result;
          this.branchList = this.brandSaveModel.BranchList;
          this.addedproductCategoryList = this.brandSaveModel.ProductCategoryList;
          this.setProductCategory();
      } else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Brand")
        );
      }
    },
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace("{0}", "Brand")
      );
    }
  );
}

// Close Dialouge
onCloseDialog() {
  this._dialog.close();
}



}
