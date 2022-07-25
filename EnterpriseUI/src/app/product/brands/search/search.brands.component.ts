
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

/********************** Component *********************/
import { DeleteConfirmationComponent } from "src/app/application-dialog-module/delete-dialog/delete.confirmation.component";
import { AppPaginationComponent } from "src/app/shared-pagination-module/app-pagination/app.pagination.component";

/* Models */
import { BrandSearchParameter, BrandViewModel } from "src/app/product/brands/brand.models";
import { ApiResponse } from "src/app/models/common.model";

/**********************  Common *********************/
import { Messages } from 'src/app/helper/config/app.messages';
import { BrandApi } from "src/app/helper/config/app.webapi";
import { Configurations } from "src/app/helper/config/app.config";
import { ViewBrandComponent } from "../view/view.brand.component";
import { SaveBrandComponent } from "../save/save.brand.component";
import { AuthService } from "src/app/helper/app.auth.service";
import { ENU_Permission_Module, ENU_Permission_Product } from "src/app/helper/config/app.module.page.enums";
import { EnumSaleSourceType, ENU_CoreUrlType, ProductModulePagesEnum } from "src/app/helper/config/app.enums";
import { environment } from "src/environments/environment.prod";
import { DataSharingService } from "src/app/services/data.sharing.service";
// import { ViewSupplierComponent } from "../view/view.supplier.component";


@Component({
  selector: "app-brands-search",
  templateUrl: "./search.brands.component.html",
})
export class SearchBrandsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;

  brandSearchParameter: BrandSearchParameter = new BrandSearchParameter();
  brandViewDetail: BrandViewModel = new BrandViewModel();
  appSourceType  = EnumSaleSourceType

  messages = Messages;
  isDataExists: boolean = false;
  brandList = [];
  statusList = [];
  typeList = [];
  branchList = [];
  productCategoryList = [];
  sortOrder_ASC = Configurations.SortOrder_ASC;
  sortOrder_DESC = Configurations.SortOrder_DESC;
  sortOrder: string;

  companyID: number;
  companyIdSubscription: ISubscription;
  env: any;
  allowedPages = {
    Save_Brand: false,
    Delete_Brand: false
  }


  constructor(
    private _httpService: HttpService,
    private _dialog: MatDialogService,
    private _messageService: MessageService,
    public _authService: AuthService,
    private _dataSharingService: DataSharingService
    )
    {
      this.env = environment.environment;
    }

  ngOnInit() {
    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    })

    this.getFundamentals();
    this.setPermission();
  }

  setPermission() {
    this.allowedPages.Save_Brand = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Brand_Save);
    this.allowedPages.Delete_Brand = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Brand_Delete);
  }

  ngAfterViewInit() {
    this.getBrandList();
  }

  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
  }


  //#Startregion

  /* Method to reset search filters */
  resetSearchFilter() {
    this.brandSearchParameter = new BrandSearchParameter();
    this.appPagination.resetPagination();
    this.getBrandList();
  }

  // Redirect URL if Add from Branch Level
  onRedirectBranchBrand(brand:any){
    const token: string = AuthService.getAccessToken();
    if (token) {
        let url = this.env.coreUrl + this.companyID + '/' + brand.BranchList[0].BranchID + '/' + ENU_CoreUrlType.Product + '/' + brand.BrandID + '/' + ProductModulePagesEnum.Brand + '/' + true + '/&?ID=' + token
        window.open(url);
    }
  }
  searchBrandList(){
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;
    this.getBrandList();
  }

  /* Get Brand list */
  getBrandList() {
    let brandSearch = JSON.parse(
      JSON.stringify(this.brandSearchParameter)
    );
    brandSearch.PageNumber = this.appPagination.pageNumber;
    brandSearch.PageSize = this.appPagination.pageSize;
    this._httpService.get(BrandApi.getBrands, brandSearch).subscribe(
      (data) => {
        this.isDataExists = data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.brandList = data.Result.filter(x => x.BranchList = x.BranchList.filter(y => y.IsIncluded == true));
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          } else {
            this.appPagination.totalRecords = 0;
          }
        } else {
          this.brandList = [];

          this.appPagination.totalRecords = 0;
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Brand")
        );
      }
    );
  }

  /* Get Search Fundamentals */
  getFundamentals() {
    this._httpService.get(BrandApi.getBrandSearchFundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode && response.MessageCode > 0) {
          this.branchList = response.Result.BranchList;
          this.statusList = response.Result.StatusList;
          this.typeList = response.Result.TypeList;
          this.productCategoryList = response.Result.ProductCategoryList;

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

  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getBrandList();
    }
  }


  /* change sorting */
  changeSorting(sortIndex: number) {
    this.brandSearchParameter.SortIndex = sortIndex;
    if (sortIndex == 1) {
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.brandSearchParameter.SortOrder = this.sortOrder;
        this.getBrandList();
      } else {
        this.sortOrder = this.sortOrder_ASC;
        this.brandSearchParameter.SortOrder = this.sortOrder;
        this.getBrandList();
      }
    }

    if (sortIndex == 2) {
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.brandSearchParameter.SortOrder = this.sortOrder;
        this.getBrandList();
      } else {
        this.sortOrder = this.sortOrder_ASC;
        this.brandSearchParameter.SortOrder = this.sortOrder;
        this.getBrandList();
      }
    }
  }

  // Add Brand
  onSaveBrand(brandID: number) {
    const _dialog = this._dialog.open(SaveBrandComponent, {
      disableClose: true,
      data: brandID
    });
    _dialog.componentInstance.isSaved.subscribe((isSaved: boolean) => {
      if (isSaved) {
        this.getBrandList();
      }
    });
  }

  /* View Brand */
  viewBrandDetail(brandID: number) {
    this._httpService.get(BrandApi.viewBrandByID + brandID).subscribe(data => {
      if (data && data.Result != null) {
        this.brandViewDetail = data.Result;

        this._dialog.open(ViewBrandComponent, {
          disableClose: true,
          data: { ...this.brandViewDetail }
        });
      }
      else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Brand')
        );
      }
    });
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace('{0}', 'Brand')
      );
    }
  }

  /* Delete Brand */
  onDeleteBrand(brandID: number) {
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Confirmation.Confirm_Delete_Title,
        header: this.messages.Delete_Messages.Del_Msg_Heading.replace("{0}", "brand"),
        description: this.messages.Delete_Messages.Del_Msg_Description.replace("{0}", "brand"),
        ButtonText:this.messages.Delete_Messages.Delete
      },
    });
    dialogRef.componentInstance.confirmDelete.subscribe(
      (confirmDelete: any) => {
        if (confirmDelete) {
          this._httpService
            .delete(BrandApi.deleteBrand + brandID)
            .subscribe(
              (response: ApiResponse) => {
                if (response && response.MessageCode > 0) {
                  this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Brand"));
                  this.resetSearchFilter();
                } else {
                  this._messageService.showErrorMessage(response.MessageText);
                }
              },
              (error) => {
                this._messageService.showErrorMessage(
                  this.messages.Error.Get_Error.replace("{0}", "Brand")
                );
              }
            );
        }
      }
    );
  }

  //#endregion
}
