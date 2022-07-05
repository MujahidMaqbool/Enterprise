
/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from "@angular/core";
/********************* Material:Refference ********************/
import { MatDialogService } from "@app/services/mat.dialog.service";
import { SubscriptionLike as ISubscription } from "rxjs";

/********************** Services & Models *********************/
/* Services */
import { HttpService } from "@services/app.http.service";
import { MessageService } from "@services/app.message.service";
/********************** Component *********************/
/* Models */
/**********************  Common *********************/
import { SaveCategoryComponent } from "./save/save.category.component";
import { ProductCategoryApi } from "@app/helper/config/app.webapi";
import { SearchCategory } from "../models/categories.model";
import { DeleteConfirmationComponent } from "@app/application-dialog-module/delete-dialog/delete.confirmation.component";
import { Messages } from "@app/helper/config/app.messages";
import { AppPaginationComponent } from "@app/shared-pagination-module/app-pagination/app.pagination.component";
import { Configurations } from "@app/helper/config/app.config";
import { MatPaginator } from "@angular/material/paginator";
import { AuthService } from "@app/helper/app.auth.service";
import { ENU_Permission_Module, ENU_Permission_Product } from "@app/helper/config/app.module.page.enums";
import { ViewCategoryComponent } from "./view/view.category.component";
import { EnumSaleSourceType , ENU_CoreUrlType , ProductModulePagesEnum} from "@app/helper/config/app.enums";
import { environment } from "environments/environment.prod";
import { DataSharingService } from "@app/services/data.sharing.service";
// import { ViewComponent } from "./view/view.category.component";
// import { SaveCategoryComponent } from "./save/save.component";


@Component({
  selector: 'app-categories-search',
  templateUrl: './search.categories.component.html'
})
export class SearchCategoriesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;

  searchCategory: SearchCategory = new SearchCategory();


  /* Pagination  */
  totalRecords: number = 0;
  pageSize = Configurations.DefaultPageSize;
  pageSizeOptions = Configurations.PageSizeOptions;
  pageNumber: number = 1;
  previousPageSize = 0;
  pageIndex = 0;

  sortIndex: number = 1;
  sortOrder_ASC: string = Configurations.SortOrder_ASC;
  sortOrder_DESC: string = Configurations.SortOrder_DESC;
  sortOrder: string = this.sortOrder_ASC;
  postionSortOrder: string;
  isPositionOrderASC: boolean = undefined;
  isCategoryNameOrderASC: boolean = true;
  isSearchByPageIndex: boolean = false;
  appSourceType  = EnumSaleSourceType;

  companyID: number;
  companyIdSubscription: ISubscription;
  messages = Messages;
  categoriesList: any = [];
  branchList: any = [];
  statusList: any = [];
  typehList: any = [];
  isDataExists: boolean;
  // #region Local members
  allowedPages = {
    Save_Category: false,
    Delete_Category: false
  }
  env:any;

  // #endregion

  constructor(
    // private _httpService: HttpService,
    private _dialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    public _authService: AuthService,
    private _dataSharingService: DataSharingService,

  ) {
    this.env = environment.environment;

  }

  ngOnInit() {
    this.getCompanyDetail();
    this.setPermission();
    this.getSearchFundamental();
  }
  ngAfterViewInit() {
    this.appPagination.resetPagination();
    this.getCategories();
  }

  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
  }

  getCompanyDetail() {
    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    })
  }


  setPermission() {
    this.allowedPages.Save_Category = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Category_Save);
    this.allowedPages.Delete_Category = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Category_Delete);
  }

  // grid sorting
  changeSorting(sortIndex: number) {
    this.sortIndex = sortIndex;
    if (sortIndex == 1) {
      this.isPositionOrderASC = undefined;
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.isCategoryNameOrderASC = false;
        this.getCategories();
      }
      else {
        this.sortOrder = this.sortOrder_ASC;
        this.getCategories();
        this.isCategoryNameOrderASC = true;
      }
    }

    if (sortIndex == 2) {
      this.isCategoryNameOrderASC = undefined;
      if (this.postionSortOrder == this.sortOrder_ASC) {
        this.isPositionOrderASC = true;
        this.sortOrder = this.sortOrder_ASC;
        this.getCategories(); this.postionSortOrder = this.sortOrder_DESC
      }
      else {
        this.sortOrder = this.sortOrder_DESC;
        this.getCategories();
        this.isPositionOrderASC = false;
        this.postionSortOrder = this.sortOrder_ASC;
      }
    }
  }

  // get fundamental for search
  getSearchFundamental() {
    this._httpService.get(ProductCategoryApi.getSearchFundamental).subscribe((respose) => {
      this.branchList = respose.Result.BranchList;
      this.statusList = respose.Result.StatusList;
      this.typehList = respose.Result.TypeList;
    });
  }

  // get categories list
  getCategories() {
    this.searchCategory.SortIndex = this.sortIndex;
    this.searchCategory.SortOrder = this.sortOrder;
    this.searchCategory.pageSize = this.appPagination.pageSize;
    this.searchCategory.pageNumber = this.appPagination.pageNumber;

    this._httpService.get(ProductCategoryApi.GetAll, this.searchCategory).subscribe((respose) => {
      this.isDataExists = respose.Result != null && respose.Result.length > 0 ? true : false;
      if (this.isDataExists) {
      //  console.log(respose.Result.filter(x => x.BranchList.filter(y => y.IsIncluded == true)));
        this.categoriesList = respose.Result.filter(x => x.BranchList = x.BranchList.filter(y => y.IsIncluded == true));
        this.appPagination.totalRecords = respose.TotalRecord;
      }
      else {
        this.categoriesList = [];
        this.appPagination.totalRecords = 0;
      }
    });
  }

  // recieved pagination index
  reciviedPagination(pagination: boolean) {
    if (pagination)
      this.getCategories();
  }

  // on reset pagination
  onSearchFilters() {
    // this.appPagination.resetPagination();
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;
    this.getCategories();
  }

  // add new categories and edit
  onAddCategory(productCategoryID: any) {
    const _dialog = this._dialog.open(SaveCategoryComponent, {
      disableClose: true,
      data: productCategoryID
    });
    _dialog.componentInstance.isSaved.subscribe((isSaved: boolean) => {
      if (isSaved) {
        this.getCategories();
      }
    });
  }

  //call view categoreis api and pass response to popup
  onViewCategory(ProductCategoryID: any) {
    this.viewCategoryID(ProductCategoryID).then((response: any) => {
      this._dialog.open(ViewCategoryComponent, {
        disableClose: true,
        data: response
      });
    })
  }

  // asynchronous api for view categories
  viewCategoryID(ProductCategoryID: number) {
    return new Promise<boolean>((resolve, reject) => {
      let param = ProductCategoryApi.viewByID + ProductCategoryID
      this._httpService.get(param).subscribe((respose) => {
        if (respose.MessageCode > 0) {
          resolve(respose.Result);
          //this.catrgoryObj = respose.Result;
        } else {
          this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Category"));
          reject();
        }
      });
    })

  }

  // delete categories and its child
  onDelete(productCategoryID: number) {
    this.deleteCategory(productCategoryID);
  }

  // reset grid filters
  onReset() {
    this.searchCategory = new SearchCategory();
    this.getCategories();
  }

  // delete categories
  deleteCategory(productCategoryID: number) {
    const deleteDialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true, data: {
        Title: this.messages.Delete_Messages.Confirm_delete, header: this.messages.Delete_Messages.Del_Msg_Heading.replace("{0}", "category"),
        description: this.messages.Delete_Messages.Del_Msg_Description.replace("{0}", "category"), ButtonText: this.messages.General.Delete
        // Title: this.messages.Delete_Messages.Delete, header: this.messages.Delete_Messages.Del_Msg_Generic.replace("{0}", "?"),
        // description: this.messages.Delete_Messages.Del_Msg_Undone, ButtonText: this.messages.General.YesDelete
      }
    });
    deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
      if (isConfirmDelete) {
        this._httpService.delete(ProductCategoryApi.delete + productCategoryID)
          .subscribe((res: any) => {
            if (res && res.MessageCode) {
              if (res && res.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Category"));
                this.getCategories();
              }
              else if (res && res.MessageCode < 0) {
                this._messageService.showErrorMessage(res.MessageText);
              }
              else {
                this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Category"));
              }
            }
          },
            err => {
              this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Category"));
            });
      }
    })
  }

  onRedirectBranchCategory(category:any){
    const token: string = AuthService.getAccessToken();
    if (token) {
        let url = this.env.coreUrl + this.companyID + '/' + category.BranchList[0].BranchID + '/' + ENU_CoreUrlType.Product + '/' + category.ProductCategoryID + '/' + ProductModulePagesEnum.Category + '/' + true + '/&?ID=' + token
        window.open(url);
    }
  }
  //#region Events
  //#endregion
}
