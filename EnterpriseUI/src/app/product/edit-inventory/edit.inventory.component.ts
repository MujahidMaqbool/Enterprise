import { Component, OnInit, ViewChild, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BulkUpdateComponent } from './bulk-update/bulk.update.component';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { element } from 'protractor';
import { AppPaginationComponent } from 'src/app/shared-pagination-module/app-pagination/app.pagination.component';
import { HttpService } from 'src/app/services/app.http.service';
import { ProductApi } from 'src/app/helper/config/app.webapi';
import { ApiResponse, DD_Branch } from 'src/app/models/common.model';
import { InventoryAdjustStock, InventoryDetail } from '../models/edit.inventory.model';
import { Messages } from 'src/app/helper/config/app.messages';
import { MessageService } from 'src/app/services/app.message.service';
import { SubscriptionLike } from 'rxjs';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { AuthService } from 'src/app/helper/app.auth.service';
import { ENU_Permission_Module, ENU_Permission_Product } from 'src/app/helper/config/app.module.page.enums';
import { ProductClassification } from 'src/app/helper/config/app.enums';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit.inventory.component.html',
})
export class EditInventoryComponent implements OnInit {

  /***********References*********/
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  currentBranchSubscription: SubscriptionLike;
  @Output() isClose = new EventEmitter<boolean>();

  /***********Messages*********/
  messages = Messages;

  /***********Enum*********/
  productClassification = ProductClassification;

  /***********Models & lists*********/
  branchList: Array<any> = [];
  InventoryDetail: InventoryDetail[] = [];
  productVariantBranchIDList: any = [];
  inventoryAdjustStock: InventoryAdjustStock = new InventoryAdjustStock();
  productVariantBranchID: any[];
  AllowedNumberKeys: any = ["-"];

  /***********Local Variables*********/
  branchId: string = "";
  currencyFormat: string;
  isSelectAll: boolean = false;
  isDataExists: boolean;
  isBulkUpdate: boolean = false;
  searchVariantName: string = "";
  isVaraintExist: boolean;
  allowedPages = {
    Save_Inventory: false,
  };


  constructor(
    private _dialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,
    public _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public productObj: any
  ) { }

  ngOnInit(): void {
    this.branchList = this.productObj.branchList;
    this.getBranchInfo();
    this.setPermission();
  }

  setPermission() {
    this.allowedPages.Save_Inventory = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Inventory_Save
    );
  }

  ngAfterViewInit() {
    this.getInventoryDetail();
  }

  onCloseDialog() {
    this.isClose.emit(true)
    this._dialog.close();
  }

  /* get Branch Info*/
  getBranchInfo() {
    // get data according to selected branch
    this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
      (branch: DD_Branch) => {
        if (branch.BranchID) {
          this.currencyFormat = branch.CurrencySymbol;
          console.log(branch);
        }
      }
    )
  }

  // on select all
  onSelectAll(event: any) {
    event.target.checked ? this.InventoryDetail.filter(x => x.ProductVariants.filter(x => x.ProductVariantBranches.filter(v => { v.isSelected = true; }))) :
      this.InventoryDetail.filter(x => x.ProductVariants.filter(x => x.ProductVariantBranches.filter(v => { v.isSelected = false; })));
    this.isBulkUpdate = event.target.checked ? true : false;
    event.target.checked ? this.extractProductBranchIdsFromList(this.InventoryDetail) : this.productVariantBranchIDList = []
  }
  // on single checkbox select
  onSingleSelect(event: any, parentIndex: number, childIndex: number, subChildIndex: number, ProductVariantBranchID: number) {
    event.target.checked ? this.InventoryDetail[parentIndex].ProductVariants[childIndex].ProductVariantBranches[subChildIndex].isSelected = true : this.InventoryDetail[parentIndex].ProductVariants[childIndex].ProductVariantBranches[subChildIndex].isSelected = false;
    this.InventoryDetail.some(x => x.ProductVariants.some(y => y.ProductVariantBranches.some(z => this.isBulkUpdate = z.isSelected === true)));
    this.InventoryDetail.every(x => x.ProductVariants.every(y => y.ProductVariantBranches.every(z => this.isSelectAll = z.isSelected === true)));
    if (event.target.checked) {
      this.productVariantBranchIDList.push({ productVariantBranchID: ProductVariantBranchID })
    } else {
      this.productVariantBranchIDList.forEach((item, index) => {
        if (item.productVariantBranchID === ProductVariantBranchID) this.productVariantBranchIDList.splice(index, 1);
      });
    }
  }

  // get inventory details
  getInventoryDetail() {
    let param = {
      productID: this.productObj.productID,
      pageNumber: this.appPagination?.pageNumber,
      PageSize: this.appPagination?.pageSize,
      productVariantName: this.searchVariantName,
      branchIDs: this.branchId
    }
    this._httpService.get(ProductApi.getProductInventoryDetail, param).subscribe(
      (response: ApiResponse) => {
        this.isDataExists = response.Result != null && response.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.InventoryDetail = response.Result;
          this.InventoryDetail.filter(x => x.ProductVariants.filter(y => y.ProductVariantBranches.filter(z => x.TotalActualStock == z.ActualCurrentStock)))
          this.InventoryDetail.filter(x => this.isVaraintExist = x.ProductVariants.length == 0 ? true : false)
          this.InventoryDetail.forEach(pElement => {
            pElement.ProductVariants.forEach(cElement => {
              cElement.ActualCurrentStock = 0;
              cElement.RetailValue = 0;
              cElement.ProductVariantBranches.forEach(subCElement => {
                //pElement.TotalActualStock += subCElement.ActualCurrentStock;
                pElement.RetailValue += subCElement.RetailValue;
                cElement.ActualCurrentStock += subCElement.ActualCurrentStock;
                cElement.RetailValue += subCElement.RetailValue;
              })
            })
          })
          this.appPagination.totalRecords = this.isVaraintExist ? 0 : response.TotalRecord;
        }
        else {
          this.InventoryDetail = [];
          this.appPagination.totalRecords = 0;
          this.isVaraintExist = true;
        }
      })
    this.productVariantBranchIDList = []
    this.isBulkUpdate = false;
    this.isSelectAll = false;
  }

  // extract productVariantBranchID from list
  extractProductBranchIdsFromList(productVariantList: InventoryDetail[]) {
    this.productVariantBranchIDList = [];
    productVariantList.filter(x => x.ProductVariants.filter(y => y.ProductVariantBranches.filter(branch => {
      this.productVariantBranchIDList.push({ productVariantBranchID: branch.ProductVariantBranchID });
    })))
  }

  // recieved pagination index
  reciviedPagination(pagination: boolean) {
    if (pagination)
      this.getInventoryDetail();
  }

  // bulk update all the seleted record  or single record
  editBulkUpdate(ProductVariantBranchID: number, isBulkUpdate: boolean) {
    if (!isBulkUpdate) {
      this.productVariantBranchID = [];
      this.getInventoryDetailByID(ProductVariantBranchID).then((isSaved) => {
        if (isSaved) {
          this.OpenBulkDialog(isBulkUpdate);
        }
      })
    } else {
      this.OpenBulkDialog(isBulkUpdate);
    }
  }

  // open bulk update dialog
  OpenBulkDialog(isBulkUpdate: boolean) {
    const _dialog = this._dialog.open(BulkUpdateComponent, {
      disableClose: true,
      data: { productVariantBranchIDList: !isBulkUpdate ? this.productVariantBranchID : this.productVariantBranchIDList, stockAdjustmentReasons: this.productObj.StockAdjustmentReasons, isBulkUpdate: isBulkUpdate, inventoryAdjustStock: this.inventoryAdjustStock }
    });
    _dialog.componentInstance.isSaved.subscribe((isSaved: boolean) => {
      if (isSaved) {
        this.productVariantBranchIDList = [];
        this.isSelectAll = false;
        this.getInventoryDetail();
      }
    });
  }

  // asynchronous api for view categories
  getInventoryDetailByID(ProductVariantBranchID: number) {
    return new Promise<boolean>((resolve, reject) => {
      this.productVariantBranchID.push({ productVariantBranchID: ProductVariantBranchID })
      this._httpService.get(ProductApi.getInventoryDetail + ProductVariantBranchID).subscribe(
        (response: ApiResponse) => {
          if (response.MessageCode > 0) {
            this.inventoryAdjustStock = response.Result;
            resolve(true);
          } else {
            reject();
            this._messageService.showErrorMessage(
              this.messages.Error.Get_Error.replace('{0}', 'Inventory Details'))
          }
        })
    })
  }
}
