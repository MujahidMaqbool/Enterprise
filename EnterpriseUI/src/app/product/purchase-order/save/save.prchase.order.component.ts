import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
/****Material references */
import { MatDatepicker } from "@angular/material/datepicker";

/*****Configurations *********/
import { AuthService } from 'src/app/helper/app.auth.service';
import { Messages } from 'src/app/helper/config/app.messages';
import { PurchaseOrderApi } from 'src/app/helper/config/app.webapi';
import { ApiResponse, DD_Branch } from 'src/app/models/common.model';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { SavePurchaseItemsComponent } from './add-product/save.add.po.product.component';
import { BranchList, SuppliersList, PurchaseOrderViewModel, ProductVariantItems } from '../models/purchaseOrder.model';
import { SubscriptionLike } from 'rxjs';
import { Configurations } from 'src/app/helper/config/app.config';
import { NgForm } from '@angular/forms';
import { DateTimeService } from 'src/app/services/date.time.service';



@Component({
  selector: 'app-save-prchase-order',
  templateUrl: './save.prchase.order.component.html'
})
export class SavePurchaseOrderComponent implements OnInit {

/***Region local members */
  messages = Messages;
  isDataExists: boolean = false;
  disableSaveBtn: boolean = false;
  submitted: boolean = false;
  isEdit: boolean = false;
  totalPrice: number = 0;
  totalItems: number = 0;
  purchaseOrderID: number;
  currencySymbol: string = "";
  minDate: Date = new Date();
  poDate:Date = new Date();
  dateFormatForSearch = 'yyyy-MM-dd';
  alreadyAddedVariants: string = "";

  @ViewChild("SavePOData") savePurchaseOrderData: NgForm;
  //@ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  
  currentBranchSubscription: SubscriptionLike;
  branchList: BranchList[] = [];
  suppliersDataList: SuppliersList[] = [];
  suppliersLsit: SuppliersList[] = [];
  purchaseOrderViewModel: PurchaseOrderViewModel = new PurchaseOrderViewModel();

  AllowedNumberKeysOnly = Configurations.AllowedNumberKeysOnly;
  

  constructor(
    private _httpService: HttpService,
    private _messageService: MessageService,
    public _authService: AuthService,
    private _dialog: MatDialogService,
    private _dataSharingService: DataSharingService,
    private _dateTimeService: DateTimeService,
    private route: ActivatedRoute,
    private _router: Router,

  ) {
    this.getFundamentals();
    this.getDefaultBranch();
   }

  ngOnInit(): void {
     //get ID from route
     this.route.params.subscribe((params: Params) => {
      this.purchaseOrderID = Number(params["ID"]);
      if (this.purchaseOrderID > 0) {
        this.isEdit = true;
        this.getPurchaseOrderByID(this.purchaseOrderID);
      } else {
        this.purchaseOrderViewModel.PurchaseOrderDate = this._dateTimeService.convertDateObjToString(this.poDate, this.dateFormatForSearch);
      }
    });

   
   
  }

  ngOnDestroy() {
    this.currentBranchSubscription?.unsubscribe();
  }

  async getDefaultBranch() {
    this.currentBranchSubscription =
      this._dataSharingService.currentBranch.subscribe((branch: DD_Branch) => {
        if (branch.BranchID && branch.hasOwnProperty("Currency")) {       
          this.currencySymbol = branch.CurrencySymbol;
        }
      });
  }

  /***** Get Search Fundamentals******/ 
  getFundamentals() {
    this._httpService.get(PurchaseOrderApi.getFundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.branchList = response.Result.branchList;
          this.suppliersDataList = response.Result.suppliersLsit;
        } else {
         this._messageService.showErrorMessage(response.MessageText);
        }
      },
      (error) => {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "purchase order fundamental"));
      }
    );
  }

  // get PO by ID
  getPurchaseOrderByID(purchaseOrderID: number) {
    this._httpService
      .get(PurchaseOrderApi.getPurchaseOrderByID + purchaseOrderID)
      .subscribe(
        (response: ApiResponse) => {
          if (response.MessageCode > 0) {
            this.purchaseOrderViewModel = response.Result;
            if(this.purchaseOrderViewModel.BranchID && this.purchaseOrderViewModel.SupplierID) {
              this.onBranchSelection(this.purchaseOrderViewModel.BranchID, this.purchaseOrderViewModel.SupplierID); 
            }                        
            if (this.purchaseOrderViewModel?.PurchaseOrderDetails?.length > 0) {
              /****Concat product name and variant for display purpose only*******/
              this.purchaseOrderViewModel?.PurchaseOrderDetails.forEach(p => {
                p.ProductName = (p.ProductVariantName && p.ProductVariantName != '') ? p.ProductName + ' - ' + p.ProductVariantName : p.ProductName;
              });  
              this.calculateTotalPriceAndItems();
              this.getAlreadyAddedVariants();
            }

          } else {
            this._messageService.showErrorMessage(response.MessageText);
          }
        },
        (error) => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "purchase order"));
        }
      );
  }

  /****On Branch change load suppliers of selected branch***** */
  onBranchSelection(branchID: number, supplierID: number = 0) {
    if (branchID && branchID > 0) {
      this.suppliersLsit = this.suppliersDataList.filter(i => i.BranchID == branchID);
    } else {
      this.suppliersLsit = [];
    }
    this.purchaseOrderViewModel.SupplierID = supplierID;

  }

  addNewProduct() {
    this.submitted = true;
    if (this.iSBranchSelected()) {
      this.getAlreadyAddedVariants();
      const _dialog = this._dialog.open(SavePurchaseItemsComponent, {
        disableClose: true,
        panelClass: "full-width-popup",
        data: {
          branchID: this.purchaseOrderViewModel.BranchID,
          supplierID: this.purchaseOrderViewModel.SupplierID,
          addedVariants: this.alreadyAddedVariants ? this.alreadyAddedVariants : ""

        }
      });

      _dialog.componentInstance.savedProductVariants.subscribe((savedItems: ProductVariantItems[]) => {
        if (savedItems && savedItems.length > 0) {
          let addedItems = savedItems;
          if (this.purchaseOrderViewModel.PurchaseOrderDetails && this.purchaseOrderViewModel.PurchaseOrderDetails.length > 0) {
              addedItems.forEach(pVariantItems => {
                this.purchaseOrderViewModel.PurchaseOrderDetails.push(pVariantItems);
              });            

          } else {

            this.purchaseOrderViewModel.PurchaseOrderDetails = addedItems;
          }
           /******asign ReorderQuantity to order Quantity ***************/
          for (let index in this.purchaseOrderViewModel.PurchaseOrderDetails) {
            if (this.purchaseOrderViewModel.PurchaseOrderDetails[index].ReorderQuantity && this.purchaseOrderViewModel.PurchaseOrderDetails[index].ReorderQuantity > 0) {
              this.purchaseOrderViewModel.PurchaseOrderDetails[index].OrderQuantity = this.purchaseOrderViewModel.PurchaseOrderDetails[index].ReorderQuantity;
            }
            this.purchaseOrderViewModel.PurchaseOrderDetails[index].TotalPrice = (this.purchaseOrderViewModel.PurchaseOrderDetails[index].OrderQuantity * this.purchaseOrderViewModel.PurchaseOrderDetails[index].SupplierPrice);
          }

          /******Calculate total price  & Total Items selected for PO *****/
          this.calculateTotalPriceAndItems();

        }
      });

    }

  }

  deleteProductVariant(i) {   
      this.purchaseOrderViewModel.PurchaseOrderDetails.splice(i, 1);
      this.getAlreadyAddedVariants();
      /******Calculate total price  & Total Items selected for PO *****/
      this.calculateTotalPriceAndItems();   
  }

  deleteProduct_From_Order_Detail(productDetailID: number, index: number) {

    this._httpService.delete(PurchaseOrderApi.deletePurchaseOrderDetailID + productDetailID)
      .subscribe((res: any) => {
        if (res && res.MessageCode) {
          if (res && res.MessageCode > 0) {
            this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Product"));
            /***********Remove Item from po detail List ****************************** *********/
              this.purchaseOrderViewModel.PurchaseOrderDetails.splice(index, 1);
              this.getAlreadyAddedVariants();           
              this.calculateTotalPriceAndItems();
            /*************************************************************************************** */
          }
          else if (res && res.MessageCode < 0) {
            this._messageService.showErrorMessage(res.MessageText);
          }
          else {
            this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "product"));
          }
        }
      },
        err => {
          this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "product"));
        });

  }

  onSupplierPrice_Quantity_Update(index: number, value: number) {
    
    this.purchaseOrderViewModel.PurchaseOrderDetails[index].TotalPrice =
      Number(this.purchaseOrderViewModel.PurchaseOrderDetails[index].OrderQuantity) * Number(this.purchaseOrderViewModel.PurchaseOrderDetails[index].SupplierPrice);

    /******Calculate total price  & Total Items selected for PO *****/
     this.calculateTotalPriceAndItems();

  }

  /**allow numeric keys and prevents others*/
  preventCharactersForNumber(event: any) {
    let index = this.AllowedNumberKeysOnly.findIndex(k => k == event.key);
    if (index < 0) {
      event.preventDefault()
    }
  }

 //#region Events
 onOpenCalendar(picker: MatDatepicker<Date>) {
  picker.open();
}

onExpectedDateChange(date: Date) {
 this.purchaseOrderViewModel.ExpectedDeliveryDate = this._dateTimeService.convertDateObjToString(date, this.dateFormatForSearch);
  this.validateDate();
}

validateDate() {
  if (this.purchaseOrderViewModel.PurchaseOrderDate > this.purchaseOrderViewModel.ExpectedDeliveryDate) {
    this.purchaseOrderViewModel.ExpectedDeliveryDate = this.purchaseOrderViewModel.PurchaseOrderDate;
  }
}

onDateChange(date: any) {
  setTimeout(() => {
      this.purchaseOrderViewModel.PurchaseOrderDate = this._dateTimeService.convertDateObjToString(date, this.dateFormatForSearch);
     this.purchaseOrderViewModel.ExpectedDeliveryDate = "";

  }, 50);
}

calculateTotalPrice(PurchaseOrderDetails): number {
  let totalPrice: number = 0;
  for (let control of PurchaseOrderDetails) {
    let inputValue = Number(control.TotalPrice);
    if (inputValue) {
      totalPrice = totalPrice + Number(control.TotalPrice);
    }
  }
  return totalPrice;
}

  countTotalItems(PurchaseOrderDetails): number {

    let totalItems: number = 0;
    for (let control of PurchaseOrderDetails) {
      let inputValue = Number(control.OrderQuantity);
      if (inputValue && inputValue > 0) {
        totalItems = totalItems + Number(control.OrderQuantity);
      }
    }
    return totalItems;
  }


getAlreadyAddedVariants() {
  this.alreadyAddedVariants = this.purchaseOrderViewModel.PurchaseOrderDetails.map(x => x.ProductVariantID).join(',');

}

async calculateTotalPriceAndItems() {
   /******Calculate total price  & Total Items selected for PO *****/
   this.purchaseOrderViewModel.TotalPrice = await this.calculateTotalPrice(this.purchaseOrderViewModel.PurchaseOrderDetails);
   this.totalPrice = this.purchaseOrderViewModel.TotalPrice;
   this.totalItems = await this.countTotalItems(this.purchaseOrderViewModel.PurchaseOrderDetails);
}

  iSValidFormData(): boolean {
    let result = true;
    if (this.purchaseOrderViewModel.BranchID < 1 || this.purchaseOrderViewModel.BranchID == null || isNaN(this.purchaseOrderViewModel.BranchID)) {
      this._messageService.showErrorMessage(this.messages.Validation.PleaseSelect.replace("{0}", "branch"));
      result = false;
      return result;
    } else if (this.purchaseOrderViewModel.SupplierID < 1 || this.purchaseOrderViewModel.SupplierID == null || isNaN(this.purchaseOrderViewModel.SupplierID)) {
      this._messageService.showErrorMessage(this.messages.Validation.PleaseSelect.replace("{0}", "supplier"));
      result = false;
      return result;
    }
    return result;
  }

  iSBranchSelected(): boolean {
    let result = true;
    if (this.purchaseOrderViewModel.BranchID < 1 || this.purchaseOrderViewModel.BranchID == null || isNaN(this.purchaseOrderViewModel.BranchID)) {
      this._messageService.showErrorMessage(this.messages.Validation.PleaseSelect.replace("{0}", "branch"));
      result = false;
      return result;
    }
    return result;
  }

  isValidOrderQuantity() {
    var result: boolean = true;

    this.purchaseOrderViewModel.PurchaseOrderDetails.forEach((element) => {
      if (element.OrderQuantity < 1 || element.OrderQuantity == null || !element.OrderQuantity) {
        result = false;
      }
    });
    return result
  }

  isValidSupplierPrice() {
    var result: boolean = true;

    this.purchaseOrderViewModel.PurchaseOrderDetails.forEach((element) => {
      if (element.SupplierPrice < 0 || element.SupplierPrice == null) {
        result = false;
      }
    });

    return result
  }

savePurchaseOrder() {

  this.submitted = true;
  if (this.iSValidFormData()) {

    if (this.purchaseOrderViewModel.PurchaseOrderDetails.length < 1) {
      this._messageService.showErrorMessage(this.messages.Validation.Product_Validation_Msg);
      return;
    } else if (!this.isValidOrderQuantity()) {
      this._messageService.showErrorMessage(this.messages.Validation.Order_Quantity_validation_Msg);
      return;
    } 
    else if (!this.isValidSupplierPrice()) {
      this._messageService.showErrorMessage(this.messages.Validation.Supplier_Price_validation_Msg);
      return;
    }

    this.disableSaveBtn = true;
    let purchaseOrder = JSON.parse(JSON.stringify(this.purchaseOrderViewModel));
    this._httpService.save(PurchaseOrderApi.savePurchaseOrder, purchaseOrder).subscribe((response) => {
      if (response.MessageCode > 0) {
        this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Purchase order"));
        this.disableSaveBtn = false;
        this._router.navigate(["product/purchase-order"]);
      } else if (response.MessageCode < 0) {
        this.disableSaveBtn = false;
        this._messageService.showErrorMessage(response.MessageText);
      } else {
        this.disableSaveBtn = false;
        this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "purchase order"));
      }

    },
      error => {
        this.disableSaveBtn = false;
        this._messageService.showErrorMessage(error);
      });
  } else {

    this._messageService.showErrorMessage(this.messages.Validation.Select_Required_Info);
  }

}



}