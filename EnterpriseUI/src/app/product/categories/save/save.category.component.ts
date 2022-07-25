import { Component, OnInit, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { WizardforProductCategory } from 'src/app/helper/config/app.enums';
import { NgForm } from '@angular/forms';
import { ProductCategory, SearchCategory } from 'src/app/product/models/categories.model';
import { CustomerApi, ProductCategoryApi } from 'src/app/helper/config/app.webapi';
import { HttpService } from 'src/app/services/app.http.service';
import { ImageEditorPopupComponent } from 'src/app/application-dialog-module/image-editor/image.editor.popup.component';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { AppUtilities } from 'src/app/helper/aap.utilities';
import { environment } from 'src/environments/environment';
import { DeleteConfirmationComponent } from 'src/app/application-dialog-module/delete-dialog/delete.confirmation.component';
import { Messages } from 'src/app/helper/config/app.messages';
import { MessageService } from 'src/app/services/app.message.service';
import { ENU_Permission_Product } from 'src/app/helper/config/app.module.page.enums';
import { BranchSelectionComponent } from 'src/app/shared-components/branch-selection/branch.selection.component';

@Component({
  selector: 'app-save',
  templateUrl: './save.category.component.html',
})
export class SaveCategoryComponent implements OnInit {

  @ViewChild('branchSelectionRef') branchSelectionRef: BranchSelectionComponent;

  serverImageAddress = environment.environment.imageUrl;
  /*********** region Local Members ****/
  @ViewChild("CategoryInformationData") categoryInformationFormData: NgForm;
  @ViewChild('stepper') stepper: MatStepper;

  messages = Messages;

  productCategory: ProductCategory = new ProductCategory();
  searchCategory: SearchCategory = new SearchCategory();
  @Output()
  isSaved = new EventEmitter<boolean>();


  //Local
  showPrevious: boolean;
  showContinue: boolean = true;
  showSave: boolean = false;
  isDisableSaveButton:boolean = false;
  inValidProductCategoryName: boolean;
  imagePath: string;
  isImageExist: boolean;
  showBranchValidation: boolean;


  constructor(
    private _dialog: MatDialogRef<SaveCategoryComponent>,
    private _matDialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public productCategoryID: any
  ) { }

  ngOnInit(): void {
    if (this.productCategoryID > 0 && this.productCategoryID != null) {
      this.productCategory.ProductCategoryID = this.productCategoryID;
      this.getCategoryID();
    } else {
      this.productCategory.ProductCategoryID = 0;
      this.getFundamental();
    }
  }
  setObjectValue(data: any) {
    this.productCategory
  }

  // get fundamental for save
  getFundamental() {
    this._httpService.get(ProductCategoryApi.getFundamental).subscribe((respose) => {
      this.productCategory.BranchList = respose.Result;
      this.productCategory.BranchList.forEach(element => {
        element.IsActive = true;
        element.IsIncluded = true;
      });
    });

  }

  // check isIncluded branch or not toggle
  onIsIncludedToggle(branchID: any, index: any) {
    this.productCategory.BranchList.forEach(branch => {
      if (branch.BranchID == branchID && !branch.IsIncluded) {
        branch.IsActive = false;
      }
    })
    this.showBranchValidation = false;
  }
  // on previous button checks the stepper and show you buttons accordingly
  onPrevious() {
    this.stepper.previous();
    this.showContinue = true;
    this.showSave = false;
  }

  // on next button checks the stepper and show you buttons accordingly
  onNext() {
    if (this.stepper.selectedIndex === WizardforProductCategory.CategoryInformation) {
      if (this.categoryInformationFormData.valid) {
        if (this.productCategory.ProductCategoryName == null || this.productCategory.ProductCategoryName == "") {
          // this.inValidProductCategoryName = true;
        } else {
          this.stepper.next();
          this.showPrevious = true;
          this.showSave = true;
          this.showContinue = false;
        }
      } else {
        this.inValidProductCategoryName = true;
      }
    }
  }
  // show the validation msg
  showValidation(event) {
    event = event.trim();
    if (event == "") {
      this.inValidProductCategoryName = true;
    } else {
      this.inValidProductCategoryName = false;
    }
  }

  // here we check that nobranch is selected then show the validation
  checkIsAnyBranchSelected() {
    let isBranchSelected = this.productCategory.BranchList.find(i => i.IsIncluded == true);
    if (isBranchSelected) {
      return true;
    }
    else {
      this.showBranchValidation = true;
      return false;
    }
  }

  // save api for categories
  onSave() {
    if (this.branchSelectionRef.checkIsAnyBranchSelected()) {
      this.isDisableSaveButton = true;
      this.productCategory.BranchList = this.branchSelectionRef.branchList;
      this.productCategory.HasBranchPermission = this.branchSelectionRef.HasBranchPermission;
      let param = JSON.parse(JSON.stringify(this.productCategory))
      this._httpService.save(ProductCategoryApi.saveCategory, param).subscribe((respose) => {
        if (respose.MessageCode > 0) {
          this.isSaved.emit(true);
          this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Category"));
          this.onCloseDialog();
        } else {
          this.isDisableSaveButton = false;
          this._messageService.showErrorMessage(respose.MessageText);
        }
      },error =>{
        this.isDisableSaveButton = false;
        this._messageService.showSuccessMessage(this.messages.Error.Save_Error.replace("{0}", "Category"));
      });
    }
  }

  // get product by id for edit
  getCategoryID() {
    let param = ProductCategoryApi.getDetailByID + this.productCategory.ProductCategoryID
    this._httpService.get(param).subscribe((respose) => {
      if (respose.MessageCode > 0) {
        this.productCategory = respose.Result;
        this.concatenateImagePath();
      } else {
        this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Category"));
      }
    });
  }


  // close popup
  onCloseDialog() {
    this._dialog.close();
  }


  //#region Image crop , set and delete region
  showImageCropperDialog() {
    const dialogInst = this._matDialog.open(ImageEditorPopupComponent, {
      disableClose: true,
      data: {
        height: 460,
        width: 720,
        aspectRatio: 720 / 460,
        showWebCam: true
      }
    });

    dialogInst.componentInstance.croppedImage.subscribe((img: string) => {
      if (img && img.length > 0) {
        this.productCategory.ImageFile = img;
        this.concatenateImagePath();
        //this.productForm.form.markAsDirty();
      }
    });
  }

  concatenateImagePath() {
    this.imagePath = "";
    if (this.productCategory.ImageFile && this.productCategory.ImageFile != "") {
      this.imagePath = "data:image/jpeg;base64," + this.productCategory.ImageFile;
      this.isImageExist = true;
    }
    else if (this.productCategory.ImagePath != undefined && this.productCategory.ImagePath != "") {
      this.imagePath = this.serverImageAddress.replace("{ImagePath}", AppUtilities.setImagePath()) + this.productCategory.ImagePath;
      this.isImageExist = true;
    }
    else {
      this.isImageExist = false;
    }
  }

  onDeleteImage() {
    const deleteDialogRef = this._matDialog.open(DeleteConfirmationComponent, { disableClose: true, data: { Title: this.messages.Delete_Messages.Confirm_delete,header: this.messages.Delete_Messages.Del_Msg_Generic.replace("{0}", "?"), description: this.messages.Delete_Messages.Del_Msg_Undone } });
    deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
      if (isConfirmDelete) {
        this.discardImage();
      }
    })
  }

  discardImage() {
    let param = {
      modulePageID: ENU_Permission_Product.Category_Delete,
      entityID: this.productCategory.ProductCategoryID,
      fileName: this.productCategory.ImagePath
    }
    this._httpService.delete(ProductCategoryApi.deleteImage, param).subscribe((response) => {
      if (response && response.MessageCode > 0) {
        this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Image"));
        this.productCategory.ImageFile = "";
        this.productCategory.ImagePath = "";
        this.concatenateImagePath();
        //this.onCloseDialog();
      } else {
        this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Image"));
      }
    });
  }
  //#endregion
}
