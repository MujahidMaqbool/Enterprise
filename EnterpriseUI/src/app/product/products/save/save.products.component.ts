// #region Imports

/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike } from "rxjs";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

/********************* Material:Refference ********************/
import { MatStepper } from '@angular/material/stepper';

/**********************  Configurations *********************/
import { ProductAreaEnum, WizardforProduct } from '@app/helper/config/app.enums';
import { ProductApi } from '@app/helper/config/app.webapi';
import { Messages } from '@app/helper/config/app.messages';

/********************** Services & Models *********************/
import { ApiResponse, DD_Branch } from '@app/models/common.model';
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { DataSharingService } from '@app/services/data.sharing.service';
import { ProductBranchPermissionViewModel, ProductMediaViewModel, ProductVariantBranchViewModel, SaveProductModel, SaveProductVariantBranchViewModel } from '@app/product/models/product.model';
import { Configurations } from '@app/helper/config/app.config';
import { MatOption } from '@angular/material/core';
import { ImageEditorPopupComponent } from '@app/application-dialog-module/image-editor/image.editor.popup.component';
import { MatDialogService } from '@app/services/mat.dialog.service';
import { ProductPriceComponent } from '../product-price/product.price.component';
import { environment } from 'environments/environment';
import { AppUtilities } from '@app/helper/aap.utilities';
import { HttpClient } from '@angular/common/http';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SaveProductPriceComponent } from '../product-price/save/save.product.price.component';

// #region end

@Component({
  selector: "app-save-product",
  templateUrl: "./save.products.component.html",
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
}]
})
export class SaveProductComponent implements OnInit {

  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild("productInformation") productInformation: NgForm;
  @ViewChild("productBranchesPermission") productBranchesPermission: NgForm;
  @ViewChild('allRestrictionSelection') private allRestrictionSelection: MatOption;
  @ViewChild('saveProductPriceRef') saveProductPriceRef: SaveProductPriceComponent;

  /***********Messages*********/
  messages = Messages;

  /***********Objects*********/
  productID:number = 0;
  /*********** Local *******************/
  showProductInformationError: boolean = false;
  showSave: boolean = false;
  showContinue: boolean = true;
  showPrevious: boolean = false;
  showBranchValidation: boolean = false;
  showPricingValidation: boolean = false;
  isSaveClicked: boolean = false;
  isShowDefaultImageSetError: boolean = false;
  currentBranchSubscription: SubscriptionLike;

  // ShowCommonError:boolean = false;


  ////////////////////////
  saveProductModel: SaveProductModel = new SaveProductModel();
  variantName: string;

  selectedRestrictedList: any[] = [];
  restrictedList = Configurations.PurchaseRestrictList;
  brandList: any[] = [];
  productCategoryList: any[] = [];
  branchList: any[] = [];
  supplierList: any[] = [];
  taxList: any[] = [];
  measurementUnitList: any[] = [];
  classificationList = Configurations.ClassificationList;

  productAreaEnum = ProductAreaEnum;

  serverImageAddress = environment.environment.imageUrl;

  constructor(
    private httpImage: HttpClient,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,
    private _router: Router,
    private route: ActivatedRoute,
    private _matDialog: MatDialogService,

  ) {
    this.saveProductModel = new SaveProductModel();
    this.serverImageAddress = this.serverImageAddress.replace("{ImagePath}", AppUtilities.setImagePath())
  }

  ngOnInit() {
    // here we get the id from route
    this.route.params.subscribe((params: Params) => {
      let productID = (params["ID"])
      this.productID = Number(productID);

      this.getFundamentals();

      if(this.productID > 0){
        this.getProductByID();
      }

    });
  }

  ngOnDestroy() {
    this.currentBranchSubscription?.unsubscribe();
  }

  //#region event start

  // Purchase restriction

  toggleAllRestrictionSelection() {
    this.selectedRestrictedList = [];

    if (this.allRestrictionSelection.selected) {
      this.restrictedList.forEach(service => {
        this.selectedRestrictedList.push(service);
      });
      setTimeout(() => {
        this.allRestrictionSelection.select();
      }, 100);
    }
  }

  togglePerOneRestriction() {
    if (this.allRestrictionSelection && this.allRestrictionSelection.selected) {
      this.allRestrictionSelection.deselect();
    }
    if (this.restrictedList.length == this.selectedRestrictedList.length && this.restrictedList.length > 1) {
      this.allRestrictionSelection.select();
    }
  }

  onChangeProductInformation(){
    this.saveProductModel.ProductName = this.saveProductModel.ProductName ? this.saveProductModel.ProductName.trim() : this.saveProductModel.ProductName;
    if(this.productInformation.valid){
      this.showProductInformationError = false;
    }
  }

  onDeleteImage(event, arrayIndex){
    this.isShowDefaultImageSetError = false;
    event.stopPropagation();
    this.saveProductModel.ProductMediaVM.splice(arrayIndex, 1);
  }

  onSetDefaultImage(event, arrayIndex){
    this.isShowDefaultImageSetError = false;
    event.stopPropagation();
    if(this.saveProductModel.ProductMediaVM[arrayIndex].IsDefault == true){
      this.saveProductModel.ProductMediaVM[arrayIndex].IsDefault = false;
    } else{
      this.saveProductModel.ProductMediaVM.forEach(media => {
        media.IsDefault = false;
      });

      this.saveProductModel.ProductMediaVM[arrayIndex].IsDefault = true;
    }

  }

  onChangeBranchAdded(event, branchData){
    if (event.checked) {
      this.showBranchValidation = false;
    }
    this.saveProductModel.ProductBranchPermissionVM.forEach((item) => {
      if (item.BranchID == branchData.BranchID) {
        item.IsActive = false;
        item.IsOnline = false;
        item.IsHidePriceOnline = false;
        item.IsFeatured = false;
        item.HasTrackInventory = false;
      }
    });
  }

  onChangeIsActive(event, branchData){
    this.saveProductModel.ProductBranchPermissionVM.forEach((item) => {
      if (item.BranchID == branchData.BranchID) {
        item.IsOnline = false;
        item.IsHidePriceOnline = false;
        item.IsFeatured = false;
      }
    });
  }

  onChangeIsOnline(event, branchData){
    this.saveProductModel.ProductBranchPermissionVM.forEach((item) => {
      if (item.BranchID == branchData.BranchID) {
        item.IsHidePriceOnline = false;
        item.IsFeatured = false;
      }
    });
  }

  //#endregion event

   //#region Image crop , set and delete region
   showImageCropperDialog(arrayIndex) {
    this.isShowDefaultImageSetError = false;
    const dialogInst = this._matDialog.open(ImageEditorPopupComponent, {
      disableClose: true,
      data: {
        height: 460,
        width: 720,
        aspectRatio: 720 / 460,
        showWebCam: true
      }
    });

    dialogInst.componentInstance.croppedImage.subscribe((imgFile: string) => {
      if (imgFile && imgFile.length > 0) {
        this.concatenateImagePath(arrayIndex, imgFile);
      }
    });
  }

  concatenateImagePath(arrayIndex, imgFile: string) {

    if(arrayIndex == null && imgFile && imgFile != ""){
      let productMediaViewModel = new ProductMediaViewModel();
      productMediaViewModel.IsDefault = this.saveProductModel.ProductMediaVM == null || this.saveProductModel.ProductMediaVM?.length == 0 ? true : false;
      productMediaViewModel.ImageFile = imgFile;
      productMediaViewModel.ImagePath = "";
      this.saveProductModel.ProductMediaVM.push(productMediaViewModel);
    }
    else if(imgFile && imgFile != "") {
      this.saveProductModel.ProductMediaVM[arrayIndex].ImageFile = imgFile;
      this.saveProductModel.ProductMediaVM[arrayIndex].ImagePath = "";
    }
  }
 //#endregion image

  // #region method start

  // get the supplier by ID
  getProductByID(){
    this._httpService.get(ProductApi.GetByID + this.productID).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.saveProductModel = response.Result;
          this.setPurchaseRestriction();
        } else {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace("{0}", "Product")
          );
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Product")
        );
      }
    );
  }

  setPurchaseRestriction() {
    if(this.saveProductModel.RestrictedCustomerTypeIDs){
      var i;
      this.selectedRestrictedList = [];
      var array = this.saveProductModel.RestrictedCustomerTypeIDs.split(',');
      for (i = 0; i < array.length; ++i) {
        var result = this.restrictedList.find(m => m.value == Number(array[i]));
        if (result) {
          this.selectedRestrictedList.push(result)
        }
      }
      // check if all selected set All true
      if (this.restrictedList && this.selectedRestrictedList && this.restrictedList.length == this.selectedRestrictedList.length) {
        setTimeout(() => {
          this.allRestrictionSelection.select();
        }, 100);
      }
    }
  }

  isSetDefaultImage(){
    if(this.saveProductModel.ProductMediaVM && this.saveProductModel.ProductMediaVM.length > 0){
      var result = this.saveProductModel.ProductMediaVM.find(i => i.IsDefault);
      if(result){
        return true;
      } else{
        this.isShowDefaultImageSetError = true;
        return false;
      }
    } else {
      return true;
    }
  }

  // stepper next button
  onNext() {
    if (this.stepper.selectedIndex === WizardforProduct.ProductInformation) {
      if (this.productInformation.valid && this.isSetDefaultImage()) {
        this.variantName = this.productID > 0 ? null : this.saveProductModel.ProductName;
        this.showProductInformationError = false;
        this.showPrevious = true;
        this.showContinue = this.productID > 0 ? false : true;
        this.showSave = this.productID > 0 ? true : false;
        this.stepper.next();
      }else {
          this.showProductInformationError = this.productInformation.valid ? false : true;
      }
    } else if (this.stepper.selectedIndex === WizardforProduct.BranchesAndPermissions) {
      if(this.checkIsAnyBranchAdded()){
          this.showProductInformationError = false;
          if(this.saveProductPriceRef?.productVariantPricingModel == null || this.saveProductPriceRef?.productVariantPricingModel.length == 0){
            this.saveProductPriceRef.preparePricingDataToShow(true, new ProductVariantBranchViewModel());
          } else{
            this.saveProductPriceRef.addNotAddedBranchAfterPrevious();
          }
          this.saveProductPriceRef.removeNotAddedBranchPricing();

          this.showPrevious = true;
          this.showContinue = false;
          this.showSave = true;
          this.stepper.next();
      }
    } 
  }

  // stepper previous button
  onPrevious() {
    this.stepper.previous();
    this.stepper.selected.editable = true;
      this.showPrevious = this.stepper.selectedIndex === WizardforProduct.ProductInformation ? false : true;
      this.showSave = false;
      this.showContinue = true;
  }

  // save the product information
  onSave() {
    if(this.productID > 0){
      if(this.checkIsAnyBranchAdded()){
        this.saveProduct();
      }
    } else{
      if(this.checkIsPricingAdded()){
        this.saveProduct();
      }
    }
  }

  saveProduct(){
    this.prepareDataForSave();
    this._httpService.save(ProductApi.saveProduct, this.saveProductModel).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Product"));
          this._router.navigate(['/product/products']);
        }else{
          this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "Product"));
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Save_Error.replace("{0}", "Product")
        );
      }
    );
  }

  prepareDataForSave(){
    if(this.selectedRestrictedList && this.selectedRestrictedList.length > 0){
      this.saveProductModel.RestrictedCustomerTypeIDs = this.listToCommaSeparatedString(this.selectedRestrictedList);
    } else{
      this.saveProductModel.RestrictedCustomerTypeIDs = "";
    }

    this.saveProductModel.ProductMediaVM = this.saveProductModel.ProductMediaVM && this.saveProductModel.ProductMediaVM.length > 0 ? this.saveProductModel.ProductMediaVM : null;

    if(this.saveProductModel.ProductMediaVM && this.saveProductModel.ProductMediaVM.length > 0){
      this.saveProductModel.ProductMediaVM.forEach(async img => {
       
      });
    }

    this.saveProductModel.ProductVariantPackagingVM = this.saveProductPriceRef?.productVariantPackagingVM.SizeVolumeUnitID > 0
                                                      || this.saveProductPriceRef?.productVariantPackagingVM.Weight 
                                                      || this.saveProductPriceRef?.productVariantPackagingVM.Length 
                                                      || this.saveProductPriceRef?.productVariantPackagingVM.Height 
                                                      || this.saveProductPriceRef?.productVariantPackagingVM.SizeVolume 
                                                       ? this.saveProductPriceRef?.productVariantPackagingVM : null;

    this.saveProductModel.ProductVariantBranchVM = [];
    this.saveProductPriceRef?.productVariantPricingModel.forEach(variant => {
      variant.ProductVariantBranchViewModel.forEach(pricing => {
        pricing.ItemTaxVM = pricing.ItemTaxVM && pricing.ItemTaxVM.length > 0 ? pricing.ItemTaxVM : null;
        pricing.CollapseItemTaxVM = null;
        pricing.SupplierID = pricing.SupplierID && pricing.SupplierID > 0 ? pricing.SupplierID : null;
        this.saveProductModel.ProductVariantBranchVM.push(pricing);
      });
    });
  }

  // here we check that nobranch is selected then show the validation
  checkIsAnyBranchAdded(){
    let isBranchSelected = this.saveProductModel.ProductBranchPermissionVM.find( i => i.IsIncluded == true);
    if(isBranchSelected){
      return true;
    }
    else{
      this.showBranchValidation = true;
      return false;
    }
  }

    // Array convert into String
    listToCommaSeparatedString(arr: any) {
      var i;
      var result: string = "";
      for (i = 0; i < arr.length; ++i) {
        if (arr[i].value !== undefined) {
          result = result + arr[i].value + ((arr.length - 1) == i ? "" : ",");
        }
      }
      return result;
    }

  checkIsPricingAdded(){
    return this.saveProductPriceRef.isPricingAdded();
  }

  // get the fundamentals list
  getFundamentals() {
    this._httpService.get(ProductApi.getSaveFundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.brandList = response.Result.BrandDDVM;
            this.branchList = response.Result.BranchDDVM;
            this.supplierList = response.Result.SupplierDDVM;
            this.productCategoryList = response.Result.ProductCategoryDDVM;
            this.taxList = response.Result.TaxDDVM;
            this.measurementUnitList = response.Result.MeasurementUnitDDVM;

          if(this.productID == 0){
            this.saveProductModel.ProductClassificationID = Number(this.classificationList[0].value);
            this.saveProductModel.ProductCategoryID = null;
            this.saveProductModel.BrandID = 0;
            this.setDefaultBranchPermissions();
          }
        } else {
          this._messageService.showErrorMessage(
            this.messages.Error.Save_Error.replace("{0}", "Product Fundamental")
          );
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Save_Error.replace("{0}", "Product Fundamental")
        );
      }
    );
  }

  setDefaultBranchPermissions() {
    this.saveProductModel.ProductBranchPermissionVM = [];
    this.branchList.forEach((branch) => {
      let pbp = new ProductBranchPermissionViewModel();
      pbp.BranchID = branch.BranchID;
      pbp.BranchName = branch.BranchName;
      pbp.IsActive = false;
      pbp.IsOnline = false;
      pbp.IsHidePriceOnline = false;
      pbp.IsFeatured = false;
      pbp.HasTrackInventory = false;
      pbp.IsIncluded = false;
      this.saveProductModel.ProductBranchPermissionVM.push(pbp);
    });
  }

    // #region method end

}
