/********************** Angular Refrences *********************/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

/***********Components *************/
import { ReceiveOrderComponent } from '../receive-order/receive.order.component';
import { EmailOrderComponent } from '../email-order/email.order.component';
import { AppPaginationComponent } from '@app/shared-pagination-module/app-pagination/app.pagination.component';
import { DateToDateFromComponent } from '@app/shared-components/app-datePicker/dateto.datefrom.component';
/********************** Services & Models *********************/
/* Services */
import { HttpService } from "@services/app.http.service";
import { MessageService } from "@services/app.message.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialogService } from '@app/services/mat.dialog.service';
import { DataSharingService } from '@app/services/data.sharing.service';
/* Models */
import { PurchaseOrderSearchParameter, BranchList, SuppliersList } from "../models/purchaseOrder.model";
import { ApiResponse, DD_Branch } from "@app/models/common.model";
import { Messages } from '@app/helper/config/app.messages';
import { AuthService } from '@app/helper/app.auth.service';
import { PurchaseOrderApi } from '@app/helper/config/app.webapi';
import { EnumPurchaseOrderStatus, EnumPurchaseOrderStatusName, EnumSaleSourceType, ENU_CoreUrlType, FileType, ProductModulePagesEnum } from '@app/helper/config/app.enums';
import { DeleteConfirmationComponent } from '@app/application-dialog-module/delete-dialog/delete.confirmation.component';
import { AlertConfirmationComponent } from '@app/application-dialog-module/confirmation-dialog/alert.confirmation.component';
import { SubscriptionLike } from 'rxjs';
import { ViewPurchaseOrderComponent } from '../view/view.purchase.order.component';
import { Configurations } from '@app/helper/config/app.config';
import { ENU_Permission_Module, ENU_Permission_Product } from '@app/helper/config/app.module.page.enums';
import { environment } from "environments/environment.prod";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-search-purchase-order',
  templateUrl: './search.purchase.order.component.html'
})
export class SearchPurchaseOrderComponent implements OnInit {

  allowedPages = {
    PO_Save: false,
    PO_Delete: false,
    EmailToSupplier: false
  };

  /**Local variables */
  purchaseOrderSearchParameter: PurchaseOrderSearchParameter = new PurchaseOrderSearchParameter();
  dateFromToPlaceHolder: string = "Created Date";
  messages = Messages;
  isDataExists: boolean = false;
  enumPOStatus = EnumPurchaseOrderStatus;
  enumAppSourceTypeID = EnumSaleSourceType;
  purchaseOrderDetails: any;
  fileType = FileType;
  companyID: number;
  currencySymbol: string = "";
  dateTimeFormat = Configurations.DateTimeFormat;
  env:any;
  AllowedNumberKeysOnly = Configurations.AllowedNumberKeysOnly;
 
  companyIdSubscription: SubscriptionLike;
  currentBranchSubscription: SubscriptionLike;

  branchList: BranchList[] = [];
  suppliersDataList: SuppliersList[] = [];
  suppliersLsit: SuppliersList[] = [];
  purchaseOrdersList: Array<any> = [];
  purchaseOrderOptions = [
    { poStatusID: EnumPurchaseOrderStatus.Ordered, poStatusName: EnumPurchaseOrderStatusName.Ordered },
    { poStatusID: EnumPurchaseOrderStatus.Received, poStatusName: EnumPurchaseOrderStatusName.Received },
    { poStatusID: EnumPurchaseOrderStatus.PartiallyReceived, poStatusName: EnumPurchaseOrderStatusName.PartiallyReceived },
    { poStatusID: EnumPurchaseOrderStatus.Cancelled, poStatusName: EnumPurchaseOrderStatusName.Cancelled }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  @ViewChild("pODateSearch") poDateSearch: DateToDateFromComponent;
  @ViewChild("poNumber") private _inputElement: ElementRef;

  constructor(
    private _dialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    public _authService: AuthService,
    private _dataSharingService: DataSharingService,
  ) {
    this.env = environment.environment;

   }

  ngOnInit(): void {  
    this.setPermission();
    this.getDefaultBranch();
    this.getFundamentals();

    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    });
  }


  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
  }
  /***Get default branch settings */
  async getDefaultBranch() {
    this.currentBranchSubscription =
      this._dataSharingService.currentBranch.subscribe((branch: DD_Branch) => {
        if (branch.BranchID && branch.hasOwnProperty("Currency")) {
          this.currencySymbol = branch.CurrencySymbol;
        }
      });
  }

  setPermission() {
    this.allowedPages.PO_Save = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.PO_Save);
    this.allowedPages.PO_Delete = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.PO_Delete);
    this.allowedPages.EmailToSupplier = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.PO_EmailToSupplier);
  }

  focusInput() {
    setTimeout(() => { this._inputElement.nativeElement.focus() }, 900)
  }

  /***** Get Search Fundamentals******/ 
  getFundamentals() {
    this._httpService.get(PurchaseOrderApi.getFundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.branchList = response.Result.branchList;
          this.purchaseOrderSearchParameter.BranchID = this.branchList ? this.branchList[0].BranchID : 0;
          this.suppliersDataList = response.Result.suppliersLsit;
          this.onBranchSelection(this.purchaseOrderSearchParameter.BranchID);
          this.getPurchaseOrdersList();
        } else {
          this._messageService.showErrorMessage(response.MessageText);
        }
      },
      (error) => {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "purchase order fundamental"));
      }
    );
  }

  /****On Branch change load suppliers of selected branch***** */
  onBranchSelection(branchID: number) {
    if (branchID && branchID > 0) {
      this.suppliersLsit = this.suppliersDataList.filter(i => i.BranchID == branchID);
    } else {
      this.suppliersLsit = this.suppliersDataList;
    }

  }
  /****Reset search parameters */
  OnResetSearch() {   
     
    this.purchaseOrderSearchParameter = new PurchaseOrderSearchParameter();
    this.purchaseOrderSearchParameter.BranchID = this.branchList ? this.branchList[0].BranchID : 0;
    this.onBranchSelection(this.purchaseOrderSearchParameter.BranchID);
    this.appPagination.resetPagination();
    //this.poDateSearch.resetDateFilter();
    this.poDateSearch.setEmptyDateFilter();
    this.getPurchaseOrdersList();
  }

  /*******view purchase order detail *********/  
  viewPurchaseOrderDetail(id: any, isPO) {
   
    let url = isPO ? PurchaseOrderApi.getPurchaseOrderDetailByID + id : PurchaseOrderApi.getGRNDetailByID + id
    this._httpService.get(url).subscribe(data => {
      if (data && data.Result != null) {
        this.purchaseOrderDetails = data.Result;
        this.purchaseOrderDetails.isPO = isPO;
        this._dialog.open(ViewPurchaseOrderComponent, {
          disableClose: true,
          data: { ...this.purchaseOrderDetails }
        });
      }
      else {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace('{0}', 'purchase order detail'));
      }
    });
    (error) => {
      this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace('{0}', 'purchase order detail'));
    }

  }
      
  viewGRNDetailByID(purchaseOrderGRNID: number) {
    this._dialog.open(ViewPurchaseOrderComponent, {
      disableClose: true,
      // data: { ...this.purchaseOrderDetails }
    });
  }

  onReceivePurchaseOrder(PurchaseOrderID: any,PurchaseOrderStatusID:number, PODate: any) {
    let _dialogRef = this._dialog.open(ReceiveOrderComponent, {
      disableClose: true,
      data: {
        PurchaseOrderID: PurchaseOrderID,
        poStatusID: PurchaseOrderStatusID,
        PurchaseOrderDate: PODate
      }
    });
    _dialogRef.componentInstance.onReceived.subscribe((isReceived: any) => {
      if (isReceived) {
        this.getPurchaseOrdersList();
      }
    });
  }

  onEmailOrder(PO: any) {
    let _dialogRef = this._dialog.open(EmailOrderComponent, {
      disableClose: true,
      data: {
        email: (PO.SupplierEmail && PO.SupplierEmail != "") ? PO.SupplierEmail : '',
        purchaseOrderID: PO.PurchaseOrderID,
        purchaseOrderStatusID: PO.PurchaseOrderStatusID

      }
    });
  }

  MarkAsReceived(purchaseOrderID: number) {
    let _dialogRef = this._dialog.open(AlertConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Delete_Messages.markAs_receive, header: this.messages.Delete_Messages.Del_Msg_AreYouSure,
        Heading: this.messages.Delete_Messages.Receive_Purchase_Order,
        Message: this.messages.Delete_Messages.Receive_Msg_Description,
        showConfirmCancelButton: true
      }
    });
    _dialogRef.componentInstance.confirmChange.subscribe((isConfirmed) => {
      if (isConfirmed) {
        this._httpService.get(PurchaseOrderApi.MarkAsReceive + purchaseOrderID)
          .subscribe((res: any) => {
            if (res && res.MessageCode) {
              if (res && res.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Mark_Received);
                this.getPurchaseOrdersList();
              }
              else if (res && res.MessageCode < 0) {
                this._messageService.showErrorMessage(res.MessageText);
              }
              else {
                this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "purchase order"));
              }
            }
          },
            err => {
              this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "purchase order"));
            });
      }
    })
  }


  deletePurchaseOrder(purchaseOrderID: number) {

    const deleteDialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true, data: {
        Title: this.messages.Delete_Messages.Confirm_delete, header: this.messages.Delete_Messages.Del_Msg_AreYouSure,
        description: this.messages.Delete_Messages.Del_Msg_Undone, ButtonText: this.messages.General.Delete
      }
    });
    deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
      if (isConfirmDelete) {
        this._httpService.delete(PurchaseOrderApi.deletePurchaseOrder + purchaseOrderID)
          .subscribe((res: any) => {
            if (res && res.MessageCode) {
              if (res && res.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Purchase order"));
                this.getPurchaseOrdersList();
              }
              else if (res && res.MessageCode < 0) {
                this._messageService.showErrorMessage(res.MessageText);
              }
              else {
                this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "purchase order"));
              }
            }
          },
            err => {
              this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "purchase order"));
            });
      }
    })


  }

  /*****Cancel Purchase Order  ******/
  cancelPurchaseOrder(purchaseOrderID: number) {
    /****For cancel purchase order same Delete component is being used with customized Icon & Text****/
    const deleteDialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true, data: {
        Title: this.messages.Delete_Messages.Cancel_Purchase_Order, header: this.messages.Delete_Messages.Cancel_Msg_AreYouSure,
        description: this.messages.Delete_Messages.Del_Msg_Undone, isCancelIcon: true
      }
    });
    deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
      if (isConfirmDelete) {
        this._httpService.get(PurchaseOrderApi.cancelPurchaseOrder + purchaseOrderID)
          .subscribe((res: any) => {
            if (res && res.MessageCode) {
              if (res && res.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Cancel_Success.replace("{0}", "Purchase order"));
                this.getPurchaseOrdersList();
              }
              else if (res && res.MessageCode < 0) {
                this._messageService.showErrorMessage(res.MessageText);
              }
              else {
                this._messageService.showErrorMessage(this.messages.Error.Cancel_Error.replace("{0}", "purchase order"));
              }
            }
          },
            err => {
              this._messageService.showErrorMessage(this.messages.Error.Cancel_Error.replace("{0}", "purchase order"));
            });
      }
    })


  }
  
  /**allow numeric keys and prevents others*/
  preventCharactersForNumber(event: any) {
    let index = this.AllowedNumberKeysOnly.findIndex(k => k == event.key);
    if (index < 0) {
      event.preventDefault()
    }
  }

  reciviedDate($event) {
    this.purchaseOrderSearchParameter.FromDate = $event.DateFrom;
    this.purchaseOrderSearchParameter.ToDate = $event.DateTo;
  }

  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getPurchaseOrdersList();
    }
  }

  // for download PO/GRN report in PDF
  downloadPurchaseOrderPDF(PO: any) {
    let isGRN: number = 0;
    if(PO.PurchaseOrderStatusID === this.enumPOStatus.Received || PO.PurchaseOrderStatusID === this.enumPOStatus.PartiallyReceived) {
      isGRN = 1;
    }
    var pdfFileName: string = PO.PurchaseOrderNumber;
    let apiURL = PurchaseOrderApi.getPurchaseOrderReport.replace('{0}', PO.PurchaseOrderID).replace('{1}', this.purchaseOrderSearchParameter.BranchID.toString()) + isGRN;
    
    this._httpService.get(apiURL) //+ "/" + this.fileType.PDF
      .toPromise().then(data => {
        if (data && data.MessageCode > 0) {
          this._dataSharingService.createPDF(data, pdfFileName);
        }
        else {
          this._messageService.showErrorMessage(this.messages.Error.Dropdowns_Load_Error.replace('{0}', "PDF"));
        }
      });
  }

  searchPurchaseOrdersList(){
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;
    this.getPurchaseOrdersList();
  }

  getPurchaseOrdersList() {
    let poSearchParams = JSON.parse(JSON.stringify(this.purchaseOrderSearchParameter));
    poSearchParams.PageNumber = this.appPagination.pageNumber;
    poSearchParams.PageSize = this.appPagination.pageSize;

    this._httpService.get(PurchaseOrderApi.getPurchaseOrdersList, poSearchParams).subscribe((data) => {

      this.isDataExists = (data.Result != null && data.Result.length > 0) ? true : false;
      if (this.isDataExists) {
        this.purchaseOrdersList = data.Result;

        if (data.Result.length > 0) {
          this.appPagination.totalRecords = data.TotalRecord;
        } else {
          this.appPagination.totalRecords = 0;
        }
      } else {
        this.purchaseOrdersList = [];
        this.appPagination.totalRecords = 0;
      }
    },
      (error) => {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "purchase orders"));
      }
    );
  }

  onRedirectBranchPO(PO:any){
    const token: string = AuthService.getAccessToken();
    if (token) {
      let url = this.env.coreUrl + this.companyID + '/' + PO.BranchID + '/' + ENU_CoreUrlType.Product + '/' + PO.PurchaseOrderID + '/' + ProductModulePagesEnum.PurchaseOrder + '/' + true + '/&?ID=' + token
      window.open(url);
    }
  }



}
