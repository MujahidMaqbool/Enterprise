
/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from "@angular/core";
/********************* Material:Refference ********************/
import { MatDialogService } from "src/app/services/mat.dialog.service";
import { SubscriptionLike as ISubscription } from "rxjs";

/********************** Services & Models *********************/
/* Services */
import { HttpService } from "src/app/services/app.http.service";
import { MessageService } from "src/app/services/app.message.service";
import { MatPaginator } from "@angular/material/paginator";

/* Models */
import { SupplierSearchParameter, SupplierViewModel } from "../../models/supplier.models";
import { ApiResponse } from "src/app/models/common.model";

/********************** Component *********************/
import { DeleteConfirmationComponent } from "src/app/application-dialog-module/delete-dialog/delete.confirmation.component";
import { AppPaginationComponent } from "src/app/shared-pagination-module/app-pagination/app.pagination.component";

/**********************  Configurations *********************/
import { Messages } from 'src/app/helper/config/app.messages';
import { SupplierApi } from "src/app/helper/config/app.webapi";
import { Configurations } from "src/app/helper/config/app.config";
import { ViewSupplierComponent } from "../view/view.supplier.component";
import { AuthService } from "src/app/helper/app.auth.service";
import { ENU_Permission_Module, ENU_Permission_Product, ENU_Permission_Setup } from "src/app/helper/config/app.module.page.enums";
import { EnumSaleSourceType, ENU_CoreUrlType, ProductModulePagesEnum } from "src/app/helper/config/app.enums";
import { environment } from "src/environments/environment.prod";
import { DataSharingService } from "src/app/services/data.sharing.service";


@Component({
  selector: "app-suppliers-search",
  templateUrl: "./search.suppliers.component.html",
})
export class SearchSuppliersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;

  // models and objects
  supplierSearchParameter: SupplierSearchParameter = new SupplierSearchParameter();
  supplierViewDetail: SupplierViewModel = new SupplierViewModel();
  supplierList: [];
  branchList = [];

  // locals
  messages = Messages;
  isDataExists: boolean = false;
  isDeleteAllow : boolean ;
  isSaveAllow : boolean ;
  appSourceType  = EnumSaleSourceType;
  companyID: number;
  companyIdSubscription: ISubscription;

  // pagination and sorting
  sortOrder_ASC = Configurations.SortOrder_ASC;
  sortOrder_DESC = Configurations.SortOrder_DESC;
  sortOrder: string;
  env:any;

  constructor(
    private _httpService: HttpService,
    private _dialog: MatDialogService,
    private _messageService: MessageService,
    private _authService: AuthService,
    private _dataSharingService: DataSharingService,

    )
    {
      this.env = environment.environment;
      this.getFundamentals();
    }

  ngOnInit() {
    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    })
  }

  ngAfterViewInit() {
    this.getSupplierList();
  }

  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
  }
  //#Start method region

  /* Method to set enum */
  setPermissions() {
    this.isDeleteAllow = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Supplier_Delete);
    this.isSaveAllow = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Supplier_Save);
  }
  /* Method to reset search filters */
  resetSearchFilter() {
    this.supplierSearchParameter = new SupplierSearchParameter();
    this.appPagination.resetPagination();
    this.getSupplierList();
  }

  searchSupplierList(){
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;
    this.getSupplierList();
  }

  /* Get Supplier list */
  getSupplierList() {
    let supplierSearch = JSON.parse(
      JSON.stringify(this.supplierSearchParameter)
    );
    supplierSearch.PageNumber = this.appPagination.pageNumber;
    supplierSearch.PageSize = this.appPagination.pageSize;
    this._httpService.get(SupplierApi.getSuppliers, supplierSearch).subscribe(
      (data) => {
        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.supplierList = data.Result;
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          } else {
            this.appPagination.totalRecords = 0;
          }
        } else {
          this.supplierList = [];

          this.appPagination.totalRecords = 0;
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Supplier")
        );
      }
    );
  }

  /* Get Search Fundamentals */
  getFundamentals() {
    this._httpService.get(SupplierApi.getSupplierFundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.branchList = response.Result;
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
    this.setPermissions();
  }

  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getSupplierList();
    }
  }


  /* change sorting */
  changeSorting(sortIndex: number) {

    this.supplierSearchParameter.SortIndex = sortIndex;
    if (sortIndex == 1) {
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.supplierSearchParameter.SortOrder = this.sortOrder;
        this.getSupplierList();
      } else {
        this.sortOrder = this.sortOrder_ASC;
        this.supplierSearchParameter.SortOrder = this.sortOrder;
        this.getSupplierList();
      }
    }

    if (sortIndex == 2) {
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.supplierSearchParameter.SortOrder = this.sortOrder;
        this.getSupplierList();
      } else {
        this.sortOrder = this.sortOrder_ASC;
        this.supplierSearchParameter.SortOrder = this.sortOrder;
        this.getSupplierList();
      }
    }
  }

  /* View Supplier */
  viewSupplierDetail(supplierID: number , appSourceTypeID:number) {
    this._httpService.get(SupplierApi.getSupplierByID + supplierID).subscribe(data => {
      if (data && data.Result != null) {
        this.supplierViewDetail.AppSourceTypeID = appSourceTypeID;
        this.supplierViewDetail = data.Result;

        this._dialog.open(ViewSupplierComponent, {
          disableClose: true,
          data: { ...this.supplierViewDetail }
        });
      }
      else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Supplier')
        );
      }
    });
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace('{0}', 'Supplier')
      );
    }
  }

  /* delete Supplier */
  onDeleteSupplier(supplierID: number) {
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Delete_Messages.Confirm_delete,
        header: this.messages.Delete_Messages.Del_Msg_Generic_Are_You_Sure.replace("{0}", "this supplier ?") ,
        description: this.messages.Delete_Messages.Del_Msg_Product_Generic.replace("{0}" , "supplier"),
        ButtonText:"Delete",
      },
    });
    dialogRef.componentInstance.confirmDelete.subscribe(
      (confirmDelete: any) => {
        if (confirmDelete) {
          this._httpService
            .delete(SupplierApi.deleteSupplier + supplierID)
            .subscribe(
              (response: ApiResponse) => {
                if (response && response.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Supplier"));
                this.resetSearchFilter();
                } else {
                  this._messageService.showErrorMessage(response.MessageText);
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
    );
  }
  onRedirectBranchSupplier(supplier:any){
    const token: string = AuthService.getAccessToken();
    if (token) {
        let url = this.env.coreUrl + this.companyID + '/' + supplier.Detail[0].BranchID + '/' + ENU_CoreUrlType.Product + '/' + supplier.SupplierID + '/' + ProductModulePagesEnum.Supplier + '/' + true + '/&?ID=' + token
        window.open(url);
    }
  }
  //#endregion
}
