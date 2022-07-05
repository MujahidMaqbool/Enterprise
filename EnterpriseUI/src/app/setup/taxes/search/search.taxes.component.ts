import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from '@app/helper/config/app.messages';
import { MatPaginator } from '@angular/material/paginator';
import { AppPaginationComponent } from '@app/shared-pagination-module/app-pagination/app.pagination.component';
import { MatDialogService } from '@app/services/mat.dialog.service';
import { SaveTaxComponent } from '../save/save.tax.component';
import { ApiResponse } from '@app/models/common.model';
import { TaxApi } from '@app/helper/config/app.webapi';
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { SearchTax } from '@app/product/models/tax.model';
import { ViewTaxComponent } from '../view/view.tax.component';
import { Configurations } from '@app/helper/config/app.config';
import { DeleteConfirmationComponent } from '@app/application-dialog-module/delete-dialog/delete.confirmation.component';
import { AuthService } from '@app/helper/app.auth.service';
import { ENU_Permission_Module, ENU_Permission_Setup } from '@app/helper/config/app.module.page.enums';
import { DataSharingService } from '@app/services/data.sharing.service';
import { SubscriptionLike as ISubscription } from "rxjs";
import { environment } from 'environments/environment';
import { ENU_CoreUrlType } from '@app/helper/config/app.enums';
@Component({
  selector: 'app-search-tax',
  templateUrl: './search.taxes.component.html'
})
export class SearchTaxComponent implements OnInit {
  // #region Local Members
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  /* Local Variables */
  isSaveTaxAllowed: boolean = false;
  isDataExists: boolean = false;
  totalRecords: number = 0;
  tax: any = {};
  sortIndex: number = 1;
  sortOrder_ASC: string = Configurations.SortOrder_ASC;
  sortOrder_DESC: string = Configurations.SortOrder_DESC;
  sortOrder: string = this.sortOrder_ASC;
  postionSortOrder: string;
  isPositionOrderASC: boolean = undefined;
  isTaxNameOrderASC: boolean = true;
  /* Messages */
  messages = Messages;

  /* Collection Types */
  allowedPermission = {
    TaxeSave: false,
    TaxDelete: false
  }
  taxList: any[] = [];
  branchList: any[] = [];
  StatusList: any[] = [];
  TypeList: any[] = [];
  SearchTaxParams: SearchTax = new SearchTax();
  companyIdSubscription: ISubscription;
  companyID: number;
  env: any;
  // #endregion
  constructor(private _dialog: MatDialogService,
    private _messageService: MessageService,
    private _dataSharingService : DataSharingService,
    private _authService: AuthService,
    private _httpService: HttpService) { this.env = environment.environment;}

  ngOnInit(): void {
    this.getSearchFundamental();
    this.setPermission();
    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    })

  }
  ngAfterViewInit() {
    this.getTaxList();
  }
  //#region  Event
  //#endregion
  //#region Methods
  onAddClick() {
    this.openDialogForSaveTax(0);
  }

  onEditClick(taxID: number) {
    this.openDialogForSaveTax(taxID);
  }

  openDialogForSaveTax(taxID: number) {
    if (taxID > 0) {
      this.openDialog(taxID)
    }
    else {
      this.openDialog(0);
    }
  }
  openDialog(taxID: any) {
    const dialogRef = this._dialog.open(SaveTaxComponent,
      {
        disableClose: true,
        data: taxID
      });

    dialogRef.componentInstance.taxSaved.subscribe((isSaved: boolean) => {
      if (isSaved) {
         this.getTaxList();
      }
    });
  }
  /* Get Search Fundamentals */
  getSearchFundamental() {
    this._httpService.get(TaxApi.getSearchFundamental).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.branchList = response.Result.BranchList;
          this.StatusList = response.Result.StatusList;
          this.TypeList = response.Result.TypeList;
        } else {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace("{0}", "Tax")
          );
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Tax")
        );
      }
    );
  }
  /* Method to reset search filters */
  resetSearchFilter() {
    this.SearchTaxParams = new SearchTax();
    this.appPagination.resetPagination();
    this.getTaxList();

  }
  setPermission() {
    this.allowedPermission.TaxeSave = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.Tax_Save);
    this.allowedPermission.TaxDelete = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.Tax_Delete);
  }

  searchTaxList(){
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;
    this.getTaxList();
  }
  /* Get Supplier list */
  getTaxList() {
    let searchTaxParams = JSON.parse(
      JSON.stringify(this.SearchTaxParams)
    );
    searchTaxParams.SortIndex = this.sortIndex;
    searchTaxParams.SortOrder = this.sortOrder;
    searchTaxParams.PageNumber = this.appPagination.pageNumber;
    searchTaxParams.PageSize = this.appPagination.pageSize;
    this._httpService.get(TaxApi.GetAll, searchTaxParams).subscribe(
      (data) => {
        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.taxList =  data.Result.filter(x => x.BranchList = x.BranchList.filter(y => y.IsIncluded == true));
          if (this.taxList.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          } else {
            this.appPagination.totalRecords = 0;
          }
        } else {
          this.taxList = [];

          this.appPagination.totalRecords = 0;
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Tax")
        );
      }
    );
  }
  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getTaxList();
    }
  }
  /* View Supplier */
  viewTaxDetail(taxID: number) {
    this._httpService.get(TaxApi.getDetailByID + taxID).subscribe(data => {
      if (data && data.Result != null) {
        this.tax = data.Result;

        this._dialog.open(ViewTaxComponent, {
          disableClose: true,
          data: { ...this.tax }
        });
      }
      else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Tax')
        );
      }
    });
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace('{0}', 'Tax')
      );
    }
  }
  // grid tax  sorting Method
  changeSorting(sortIndex: number) {
    this.sortIndex = sortIndex;
    if (sortIndex == 1) {
      this.isPositionOrderASC = undefined;
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.isTaxNameOrderASC = false;
        this.getTaxList();
      }
      else {
        this.sortOrder = this.sortOrder_ASC;
        this.getTaxList();
        this.isTaxNameOrderASC = true;
      }
    }
    if (sortIndex == 2) {
      this.isTaxNameOrderASC = undefined;
      if (this.postionSortOrder == this.sortOrder_ASC) {
        this.isPositionOrderASC = true;
        this.sortOrder = this.sortOrder_ASC;
        this.getTaxList(); this.postionSortOrder = this.sortOrder_DESC
      }
      else {
        this.sortOrder = this.sortOrder_DESC;
        this.getTaxList();
        this.isPositionOrderASC = false;
        this.postionSortOrder = this.sortOrder_ASC;
      }
    }
  }
  /*** Tax Delete Method */
  deleteTax(taxID: number) {
    const deleteDialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true, data: {
        Title: this.messages.Delete_Messages.Confirm_delete,
        header: this.messages.Delete_Messages.Del_Msg_Heading.replace("{0}", "tax"),
        description: this.messages.Delete_Messages.Del_Msg_Description.replace("{0}", "tax"),
        ButtonText: this.messages.General.Delete
      }
    });
    deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
      if (isConfirmDelete) {
        this._httpService.delete(TaxApi.delete + taxID)
          .subscribe((res: any) => {
            if (res && res.MessageCode) {
              if (res && res.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Tax"));
                this.getTaxList();
              }
              else if (res && res.MessageCode < 0) {
                this._messageService.showErrorMessage(res.MessageText);
              }
              else {
                this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Tax"));
              }
            }
          },
            err => {
              this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Tax"));
            });
      }
    })
  }
  onRouteUrl(tax:any) {
    const token: string = AuthService.getAccessToken();
    if (token) {
      let url = this.env.coreUrl  + this.companyID + '/' + tax.BranchList[0].BranchID + '/' + ENU_CoreUrlType.Setup_Tax + '/' + tax.TaxID +'/' +'0'+'/' + false + '/&?ID=' + token
      window.open(url);
    }
  }
  //#endregion

}
