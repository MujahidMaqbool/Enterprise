/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from "@angular/core";
import { SubscriptionLike as ISubscription } from "rxjs";

/********************* Material:Refference ********************/
import { MatDialogService } from "@app/services/mat.dialog.service";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";

/********************** Services & Models *********************/
/* Services */
import { HttpService } from "@services/app.http.service";
import { MessageService } from "@services/app.message.service";
import { MatPaginator } from "@angular/material/paginator";
import { LoaderService } from "@app/services/app.loader.service";
import { AuthService } from "@app/helper/app.auth.service";

/* Models */
import { ApiResponse, DD_Branch } from "@app/models/common.model";
import { AllProductSelectToggleModel } from "@app/models/all-select-toggle-model";
import { HideAndShowFavouriteViewColumnProduct, HideAndShowFavouriteViewColumnProductForFavView, ProductSearchParameter, SupplierDropDown } from "@app/product/models/product.model";

/********************** Component *********************/
import { DeleteConfirmationComponent } from "@app/application-dialog-module/delete-dialog/delete.confirmation.component";
import { AppPaginationComponent } from "@app/shared-pagination-module/app-pagination/app.pagination.component";
import { ProductPriceComponent } from "../product-price/product.price.component";
import { ViewProductComponent } from "../view/view.products.component";
import { DateToDateFromComponent } from "@app/shared-components/app-datePicker/dateto.datefrom.component";

/**********************  Configurations *********************/
import { Messages } from "@helper/config/app.messages";
import { ProductApi } from "@app/helper/config/app.webapi";
import { Configurations } from "@app/helper/config/app.config";
import { ProductFavouriteViewColumnNameString, Product_SearchFundamental_DropDowns, ProductAreaEnum, ENU_CoreUrlType, ProductModulePagesEnum, EnumSaleSourceType, ProductClassification} from "@app/helper/config/app.enums";
import { ENU_Permission_Module, ENU_Permission_Product} from "@app/helper/config/app.module.page.enums";
import { Router } from "@angular/router";
import { ProductVariantComponent } from "@app/product/product-variant/product.variant.component";
import { EditInventoryComponent } from "@app/product/edit-inventory/edit.inventory.component";
import { DataSharingService } from "@app/services/data.sharing.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-products-search",
  templateUrl: "./search.products.component.html",
})
export class SearchProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  @ViewChild("productDateSearch") productDateSearch: DateToDateFromComponent;

  @ViewChild("allSelectedBranch") public allSelectedBranch: MatOption;
  @ViewChild("branchSelect") branchSelect: MatSelect;

  @ViewChild("allProductCategorySelected") public allProductCategorySelected: MatOption;
  @ViewChild("selectProductCategory") selectProductCategory: MatSelect;

  @ViewChild("selectProductBrand") selectProductBrand: MatSelect;
  @ViewChild("allProductBrandSelected") public allProductBrandSelected: MatOption;

  @ViewChild("selectProductSupplier") selectProductSupplier: MatSelect;
  @ViewChild("allProductSupplierSelected") public allProductSupplierSelected: MatOption;

  productAreaEnum = ProductAreaEnum;

  companyIdSubscription: ISubscription;


  // models and objects
  productSearchParameter: ProductSearchParameter = new ProductSearchParameter();
  favouriteViewColumnNameList: Array<any> = Configurations.ProductFavouriteViewColumnNameList;
  dummyFavouriteViewColumnNameList: Array<any> = Configurations.ProductDefaultViewColumnNameList;
  hideAndShowFavouriteViewColumn: HideAndShowFavouriteViewColumnProduct = new HideAndShowFavouriteViewColumnProduct();
  deepCopyFavouriteViewColumnNameList: Array<any> = [];

  selectedFavouriteViewColumn: Array<number> = [];
  Product_SearchFundamental_DropDowns = Product_SearchFundamental_DropDowns;
  allSelectToggleModel: AllProductSelectToggleModel = new AllProductSelectToggleModel();
  selectedBranchesList: Array<any> = [];

  branchList: Array<any> = [];
  StockAdjustmentReasons: Array<any> = [];
  statusList: Array<any> = [];
  productTypes: Array<any> = [];
  productClassifications: Array<any> = [];

  suppliers: Array<SupplierDropDown> = [];
  brands: Array<any> = [];
  productCategories: Array<any> = [];
  productList: Array<any> = [];
  copySuppliers: Array<SupplierDropDown> = [];
  copyBrands: Array<any> = [];
  copyProductCategories: Array<any> = [];

  selectedProductCategoryList: Array<any> = [];
  selectedProductBrandList: Array<any> = [];
  selectedProductSupplierList: Array<any> = [];
  currentBranchSubscription: ISubscription;
  productClassification = ProductClassification;
  // locals
  messages = Messages;
  isDataExists: boolean = false;
  dateToPlaceHolder: string = "Product Created Date";
  dateFromPlaceHolder: string = "Product Created Date";
  dateToLabel: string = "Date Created (To)";
  dateFromLabel: string = "Date Created (From)";


  isAdvanceSearch: boolean = false;
  canResetEnable: boolean = false;
  showDropDownGrid: boolean;
  currencyFormat: string;
  companyID: number;
  env: any;

  enum_AppSourceType = EnumSaleSourceType;
  enum_Product_ClassificationType = ProductClassification;
  allowedPages = {
    Save_Product: false,
    Delete_Product: false,
    Inventory_View: false,
    Pricing_View: false,
  };

  constructor(
    private _httpService: HttpService,
    private _dialog: MatDialogService,
    private _messageService: MessageService,
    private _loaderService: LoaderService,
    public _authService: AuthService,
    private _dataSharingService: DataSharingService,
    private _router: Router

  ) {
    this.env = environment.environment;
    this.deepCopyFavouriteViewColumnNameList = JSON.parse(JSON.stringify(this.favouriteViewColumnNameList));
    this.getCompanyInfo();
    this.getFundamentals();
    this.getBranchInfo();
  }

  ngOnInit() {
    this.setPermission();
    this.getFavouriteView();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.currentBranchSubscription?.unsubscribe();
    this.companyIdSubscription?.unsubscribe();
  }

  //#Start method region

  setPermission() {
    this.allowedPages.Save_Product = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Product_Save
    );
    this.allowedPages.Delete_Product = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Product_Delete
    );
    this.allowedPages.Inventory_View = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Inventory_Save
    );
    this.allowedPages.Pricing_View = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Pricing_Save
    );
  }

  getCompanyInfo(){
    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    });
  }

  //click on search method to set the pagination and other things
  onClickSearchProduct(){
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;

    //this.appPagination.pageSize = 10;

    this.productSearchParameter.ProductName = this.productSearchParameter?.ProductName ? this.productSearchParameter.ProductName.trim() : this.productSearchParameter.ProductName;
    this.searchAllProducts()
  }

  /* Get Product list */
  searchAllProducts() {
    this.mapProductSearchFilters();
    let productSearch = JSON.parse(JSON.stringify(this.productSearchParameter));
    productSearch.PageNumber = this.appPagination.pageNumber;
    productSearch.PageSize = this.appPagination.pageSize;

    this._httpService.save(ProductApi.productSearch, productSearch).subscribe(
      (data: ApiResponse) => {
        this.isDataExists = data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.appPagination.totalRecords = data.TotalRecord;
          this.productList = data.Result;

        } else {
          this.appPagination.totalRecords = 0;
          this.productList = [];

        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Product")
        );
      }
    );
  }

  //here we map the data to search parameter objects
  mapProductSearchFilters() {
    if (this.allSelectToggleModel.isAllSelectedBranch) {
      this.productSearchParameter.BranchIDs = null
    } else {
      this.productSearchParameter.BranchIDs = this.selectedBranchesList.map((x) => x.BranchID).join(",");
    }
    if (this.isAdvanceSearch) {
      if (!this.allSelectToggleModel.isAllSelectedProductCategory ) {
        this.productSearchParameter.ProductCategoryIDs = this.selectedProductCategoryList.map((x) => x.ProductCategoryID).join(",");
      } else {
        this.productSearchParameter.ProductCategoryIDs = null;
      }

      if (!this.allSelectToggleModel.isAllSelectedProductBrand ) {
        this.productSearchParameter.BrandIDs = this.selectedProductBrandList.map((x) => x.BrandID).join(",");
      } else {
        this.productSearchParameter.BrandIDs = null;
      }

      if (!this.allSelectToggleModel.isAllSelectedProductSupplier ) {
        this.productSearchParameter.SupplierIDs =  this.selectedProductSupplierList.map((x) => x.SupplierID).join(",") ;
      } else {
        this.productSearchParameter.SupplierIDs = null;
      }
    }
  }

  /* Get Search Fundamentals */
  getFundamentals() {
    this._httpService.get(ProductApi.getProductFundamentals).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.branchList = response.Result.Branches;
          this.StockAdjustmentReasons = response.Result.StockAdjustmentReasons;
          this.statusList = response.Result.StatusList;
          this.productTypes = response.Result.ProductTypes;
          this.productClassifications = response.Result.ProductClassifications;
          this.suppliers = response.Result.Suppliers;
          this.brands = response.Result.Brands;
          this.productCategories = response.Result.ProductCategories;

          this.copySuppliers = response.Result.Suppliers;
          this.copyBrands = response.Result.Brands;
          this.copyProductCategories = response.Result.ProductCategories;
          setTimeout(() => {
            if (this.branchSelect) {
              this.branchSelect.options.forEach((item: MatOption) => {
                if (item.viewValue == "All")
                  this.allSelectToggleModel.isAllSelectedBranch = true;
                item.select();
              });
              this.searchAllProducts();
            }
          }, 100);

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

  /* apply and also save the view */
  onSaveAndApplyFavView(isFromApply) {
    this.mapFavView();
    var FavColumnArray = [];
    if (this.selectedFavouriteViewColumn.length > 0) {
      this.selectedFavouriteViewColumn.forEach((i) => {
        var findIndex = this.favouriteViewColumnNameList.find(x => x.FavouriteViewColumnIndex == i);
        if (findIndex) {
          FavColumnArray.push(findIndex)
        }
      })
    }

    AuthService.setFavViewProduct(FavColumnArray as any);

    this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Favourite View"));
    this.showDropDownGrid = false;
    this.selectedFavouriteViewColumn = [];
    this.getFavouriteView();

  }

  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.searchAllProducts();
    }
  }

  /* get Branch Info*/
  getBranchInfo() {
    // get data according to selected branch
    this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
      (branch: DD_Branch) => {
        if (branch.BranchID) {
          this.currencyFormat = branch.CurrencySymbol;
        }
      }
    )
  }

  /* delete Product */
  onDeleteProduct(productID: number) {
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Delete_Messages.Confirm_delete,
        header: this.messages.Delete_Messages.Del_Msg_Generic.replace("{0}", "this product ?"),
        description: this.messages.Delete_Messages.Del_Msg_Product_Generic.replace("{0}", "product"),
      },
    });
    dialogRef.componentInstance.confirmDelete.subscribe(
      (confirmDelete: any) => {
        if (confirmDelete) {
          this._httpService
            .delete(ProductApi.deleteProduct + productID)
            .subscribe(
              (response: ApiResponse) => {
                if (response && response.MessageCode > 0) {
                  this._messageService.showSuccessMessage(
                    this.messages.Success.Delete_Success.replace(
                      "{0}",
                      "Product"
                    )
                  );
                  this.resetSearchFilter();
                } else {
                  this._messageService.showErrorMessage(response.MessageText);
                }
              },
              (error) => {
                this._messageService.showErrorMessage(
                  this.messages.Error.Get_Error.replace("{0}", "Product")
                );
              }
            );
        }
      }
    );
  }

  // received date event when change date
  reciviedDate($event) {
    this.productSearchParameter.FromCreationDate = $event.DateFrom;
    this.productSearchParameter.ToCreationDate = $event.DateTo;
  }

  /* Method to set the toggle  Fav View*/
  togglePersonalGrid(show: boolean) {
    setTimeout(() => {
      this.showDropDownGrid = show;
    });
  }

  //#region  Fav View
  mapFavView() {
    this.favouriteViewColumnNameList.forEach((productView) => {
      if (productView.selected) {
        this.selectedFavouriteViewColumn.push(
          productView.FavouriteViewColumnIndex
        );
      }
    });
  }

  //on apply temporaray fav view
  onApply(isFromApply: boolean) {
    this._loaderService.show();
    setTimeout(() => {
      this.temporaryFavView();
      this._loaderService.hide();
      this.canResetEnable = true;
    }, 1000);
  }

  //temporaray fav view (not saved on backend)
  temporaryFavView() {
    this.dummyFavouriteViewColumnNameList = [...this.favouriteViewColumnNameList];
    this.favouriteViewColumnNameList.forEach((x) => {
      if (x.selected == false) {
        this.dummyFavouriteViewColumnNameList.splice(this.dummyFavouriteViewColumnNameList.indexOf(x),1);
      }
    });
    this.favouriteViewColumnNameList.forEach((x) => {
      if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Product
      ) {
        this.hideAndShowFavouriteViewColumn.isProductColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.Classification
      ) {
        this.hideAndShowFavouriteViewColumn.isClassificationColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Type
      ) {
        this.hideAndShowFavouriteViewColumn.isTypeColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.Category
      ) {
        this.hideAndShowFavouriteViewColumn.isCategoryColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Brand
      ) {
        this.hideAndShowFavouriteViewColumn.isBrandColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Branch
      ) {
        this.hideAndShowFavouriteViewColumn.isBranchColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.PurchaseRestriction) {
        this.hideAndShowFavouriteViewColumn.isPurchaseRestrictionColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.VariantStatus) {
        this.hideAndShowFavouriteViewColumn.isVarientStatusColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.ProductStatus) {
        this.hideAndShowFavouriteViewColumn.isProductStatusColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.ShowOnline
      ) {
        this.hideAndShowFavouriteViewColumn.isShowOnlineColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.HidePriceOnline
      ) {
        this.hideAndShowFavouriteViewColumn.isHidePriceOnlineColumn =
          x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.Featured
      ) {
        this.hideAndShowFavouriteViewColumn.isFeaturedColumn = x.selected;
      }
      // if (
      //   x.FavouriteViewColumnName ===
      //   ProductFavouriteViewColumnNameString.BusinessUseOnly
      // ) {
      //   this.hideAndShowFavouriteViewColumn.isBusinessUseOnlyColumn =
      //     x.selected;
      // }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.TrackInventory
      ) {
        this.hideAndShowFavouriteViewColumn.isTrackInventoryColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.Shipping
      ) {
        this.hideAndShowFavouriteViewColumn.isShippingColumn = x.selected;
      }

      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.BarCode
      ) {
        this.hideAndShowFavouriteViewColumn.isBarCodeColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.SKU
      ) {
        this.hideAndShowFavouriteViewColumn.isSKUColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.Supplier
      ) {
        this.hideAndShowFavouriteViewColumn.isSupplierColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.SupplerCode
      ) {
        this.hideAndShowFavouriteViewColumn.isSupplerCodeColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.SupplierPrice
      ) {
        this.hideAndShowFavouriteViewColumn.isSupplierPriceColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Price
      ) {
        this.hideAndShowFavouriteViewColumn.isPriceColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Tax
      ) {
        this.hideAndShowFavouriteViewColumn.isTaxColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.RetailPrice
      ) {
        this.hideAndShowFavouriteViewColumn.isRetailPriceColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.CurrentStock
      ) {
        this.hideAndShowFavouriteViewColumn.isCurrentStockColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.ReorderQuantity
      ) {
        this.hideAndShowFavouriteViewColumn.isReorderQuantityColumn =
          x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.ThresholdPointColumn
      ) {
        this.hideAndShowFavouriteViewColumn.isThresholdPointColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.StockValue
      ) {
        this.hideAndShowFavouriteViewColumn.isStockValueColumn = x.selected;
      }
      if (
        x.FavouriteViewColumnName ===
        ProductFavouriteViewColumnNameString.RetailValue
      ) {
        this.hideAndShowFavouriteViewColumn.isRetailValueColumn = x.selected;
      }
    });
    this.showDropDownGrid = false;
  }

  // get the fav view
  getFavouriteView() {
    var favouriteViews: any = [];


    favouriteViews = JSON.parse(AuthService.getFavViewProduct());
    if (favouriteViews) {
      this.dummyFavouriteViewColumnNameList = [];
      if (favouriteViews.length > 0) {
        this.favouriteViewColumnNameList.forEach((i) => {
          var findIndex = favouriteViews.find(x => x.FavouriteViewColumnIndex == i.FavouriteViewColumnIndex);
          if (findIndex) {
            i.selected = true;
          } else {
            i.selected = false;
          }
        })
      }
      this.canResetEnable = favouriteViews && favouriteViews.length > 0 ? true : false;
      this.dummyFavouriteViewColumnNameList = favouriteViews;
      this.hideAndShowFavouriteViewColumn = new HideAndShowFavouriteViewColumnProductForFavView();
      this.hideAndShowFavouriteViewColumns(favouriteViews, false);


    } else {
      this.canResetEnable = false;
      this.favouriteViewColumnNameList = [];
      this.favouriteViewColumnNameList = Configurations.ProductFavouriteViewColumnNameList;
      this.dummyFavouriteViewColumnNameList = Configurations.ProductDefaultViewColumnNameList;
      this.hideAndShowFavouriteViewColumn = new HideAndShowFavouriteViewColumnProduct();

      if (this.dummyFavouriteViewColumnNameList.length > 0) {
        this.favouriteViewColumnNameList.forEach((i) => {
          var findIndex = this.dummyFavouriteViewColumnNameList.find(x => x.FavouriteViewColumnIndex == i.FavouriteViewColumnIndex);
          if (findIndex) {
            i.selected = true;
          } else {
            i.selected = false;

          }
        })
      }
      this.hideAndShowFavouriteViewColumns(this.dummyFavouriteViewColumnNameList, false);
    }

  }

  //hide and show the view (fav view oe default view)
  hideAndShowFavouriteViewColumns(favouriteViewColumnNameList: Array<any>, isFromApply?: boolean) {
    if (favouriteViewColumnNameList && favouriteViewColumnNameList.length > 0) {
      favouriteViewColumnNameList.forEach((x) => {
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Product) {
          this.hideAndShowFavouriteViewColumn.isProductColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Classification) {
          this.hideAndShowFavouriteViewColumn.isClassificationColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.ProductStatus) {
          this.hideAndShowFavouriteViewColumn.isProductStatusColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Type
        ) {
          this.hideAndShowFavouriteViewColumn.isTypeColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Category
        ) {
          this.hideAndShowFavouriteViewColumn.isCategoryColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Brand
        ) {
          this.hideAndShowFavouriteViewColumn.isBrandColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Branch
        ) {
          this.hideAndShowFavouriteViewColumn.isBranchColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.PurchaseRestriction) {
          this.hideAndShowFavouriteViewColumn.isPurchaseRestrictionColumn = true;
          x.isDefault = true;
          x.selected = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.VariantStatus) {
          this.hideAndShowFavouriteViewColumn.isVarientStatusColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.ShowOnline
        ) {
          this.hideAndShowFavouriteViewColumn.isShowOnlineColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.HidePriceOnline
        ) {
          this.hideAndShowFavouriteViewColumn.isHidePriceOnlineColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Featured
        ) {
          this.hideAndShowFavouriteViewColumn.isFeaturedColumn = true;
          x.isDefault = true;
        }
        // if (
        //   x.FavouriteViewColumnName ===
        //   ProductFavouriteViewColumnNameString.BusinessUseOnly
        // ) {
        //   this.hideAndShowFavouriteViewColumn.isBusinessUseOnlyColumn = true;
        //   x.isDefault = true;
        // }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.TrackInventory
        ) {
          this.hideAndShowFavouriteViewColumn.isTrackInventoryColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Shipping
        ) {
          this.hideAndShowFavouriteViewColumn.isShippingColumn = true;
          x.isDefault = true;
        }

        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.BarCode
        ) {
          this.hideAndShowFavouriteViewColumn.isBarCodeColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.SKU)
        {
          this.hideAndShowFavouriteViewColumn.isSKUColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Supplier
        ) {
          this.hideAndShowFavouriteViewColumn.isSupplierColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.SupplerCode
        ) {
          this.hideAndShowFavouriteViewColumn.isSupplerCodeColumn = true;
          x.isDefault = true;
        }
        if ( x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.SupplierPrice
        ) {
          this.hideAndShowFavouriteViewColumn.isSupplierPriceColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Price
        ) {
          this.hideAndShowFavouriteViewColumn.isPriceColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.Tax)
        {
          this.hideAndShowFavouriteViewColumn.isTaxColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.RetailPrice
        ) {
          this.hideAndShowFavouriteViewColumn.isRetailPriceColumn = true;
          x.isDefault = true;
        }

        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.CurrentStock) {
          this.hideAndShowFavouriteViewColumn.isCurrentStockColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.ReorderQuantity
        ) {
          this.hideAndShowFavouriteViewColumn.isReorderQuantityColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.ThresholdPointColumn
        ) {
          this.hideAndShowFavouriteViewColumn.isThresholdPointColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.StockValue
        ) {
          this.hideAndShowFavouriteViewColumn.isStockValueColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === ProductFavouriteViewColumnNameString.RetailValue
        ) {
          this.hideAndShowFavouriteViewColumn.isRetailValueColumn = true;
          x.isDefault = true;
        }
      });
    }
  }

  // on advance search button
  toggleAdvanceSearch() {
    this.isAdvanceSearch = !this.isAdvanceSearch;
    this.productSearchParameter.HasTrackInventory = null;
    this.productSearchParameter.IsOnline = null;
    this.filterDropDownAccordingToBranch(this.selectedBranchesList);

    setTimeout(() => {
      if (this.isAdvanceSearch) {
        this.productDateSearch.setEmptyDateFilter();

        if (this.selectProductCategory) {
          if(this.selectProductCategory.options.length > 1){
          this.selectProductCategory.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedProductCategory = true;
            item.select();
          });
        }
        // else{
        //   this.allSelectToggleModel.isAllSelectedProductCategory = true;
        // }
        }

        if (this.selectProductBrand) {
          if(this.selectProductBrand.options.length > 1){
          this.selectProductBrand.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedProductBrand = true;
            item.select();
          });
        }
        // else{
        //   this.allSelectToggleModel.isAllSelectedProductBrand = true;
        // }
        }

        if (this.selectProductSupplier) {
         if(this.selectProductSupplier.options.length > 1){
          this.selectProductSupplier.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedProductSupplier = true;
            item.select();
          });
        }
        // else{
        //   this.allSelectToggleModel.isAllSelectedProductSupplier = true;
        // }
        }
      }
    }, 200);
  }

  //for all  selection
  toggleAllSelection(type) {
    switch (type) {
      case this.Product_SearchFundamental_DropDowns.ProductBranches: {
        this.selectedBranchesList = [];
        if (this.allSelectedBranch.selected) {
          this.branchList.forEach((branch) => {
            this.selectedBranchesList.push(branch);
          });
          setTimeout(() => {
            this.allSelectedBranch.select();
            this.allSelectToggleModel.isAllSelectedBranch = true;
          }, 200);
          this.filterDropDownAccordingToBranch(this.selectedBranchesList);
        } else {
          this.filterDropDownAccordingToBranch(null);
        }
        break;
      }

      case this.Product_SearchFundamental_DropDowns.ProductCategory: {
        this.selectedProductCategoryList = [];
        if (this.allProductCategorySelected.selected) {
          this.productCategories.forEach((branch) => {
            this.selectedProductCategoryList.push(branch);
          });
          setTimeout(() => {
            this.allProductCategorySelected.select();
            this.allSelectToggleModel.isAllSelectedProductCategory = true;
          }, 200);
        }
        break;
      }

      case this.Product_SearchFundamental_DropDowns.ProductBrand: {
        this.selectedProductBrandList = [];
        if (this.allProductBrandSelected.selected) {
          this.brands.forEach((branch) => {
            this.selectedProductBrandList.push(branch);
          });

          setTimeout(() => {
            this.allProductBrandSelected.select();
            this.allSelectToggleModel.isAllSelectedProductBrand = true;
          }, 200);
        }
        break;
      }

      case this.Product_SearchFundamental_DropDowns.ProductSupplier: {
        this.selectedProductSupplierList = [];
        if (this.allProductSupplierSelected.selected) {
          this.suppliers.forEach((branch) => {
            this.selectedProductSupplierList.push(branch);
          });
          setTimeout(() => {
            this.allProductSupplierSelected.select();
            this.allSelectToggleModel.isAllSelectedProductSupplier = true;
          }, 200);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  //for single  selection
  tosslePerOneItem(type) {

    switch (type) {
      case this.Product_SearchFundamental_DropDowns.ProductCategory: {
        if (this.productCategories && this.allProductCategorySelected && this.allProductCategorySelected.selected) {
          this.allProductCategorySelected.deselect();
          this.allSelectToggleModel.isAllSelectedProductCategory = this.allProductCategorySelected.selected;
          return false;
        }
        if (this.productCategories.length == this.selectedProductCategoryList.length && this.productCategories.length > 1)
          this.allProductCategorySelected.select();
          this.allSelectToggleModel.isAllSelectedProductCategory = this.allProductCategorySelected.selected;
          break;
      }

      case this.Product_SearchFundamental_DropDowns.ProductBrand: {
        if (this.brands && this.allProductBrandSelected && this.allProductBrandSelected.selected) {
          this.allProductBrandSelected.deselect();
          this.allSelectToggleModel.isAllSelectedProductBrand = this.allProductBrandSelected.selected;
          return false;
        }
        if (this.brands.length == this.selectedProductBrandList.length && this.brands.length > 1 )
          this.allProductBrandSelected.select();
          this.allSelectToggleModel.isAllSelectedProductBrand = this.allProductBrandSelected.selected;
        break;
      }

      case this.Product_SearchFundamental_DropDowns.ProductBranches: {
        this.filterDropDownAccordingToBranch(this.selectedBranchesList);
        if (this.branchList && this.allSelectedBranch && this.allSelectedBranch.selected) {
          this.allSelectedBranch.deselect();
          this.allSelectToggleModel.isAllSelectedBranch = this.allSelectedBranch.selected;
          return false;
        }
        if (this.branchList.length == this.selectedBranchesList.length && this.branchList.length > 1)
          this.allSelectedBranch.select();
          this.allSelectToggleModel.isAllSelectedBranch = this.allSelectedBranch.selected;
        break;
      }

      case this.Product_SearchFundamental_DropDowns.ProductSupplier: {
        if (this.suppliers && this.allProductSupplierSelected && this.allProductSupplierSelected.selected) {
          this.allProductSupplierSelected.deselect();
          this.allSelectToggleModel.isAllSelectedProductSupplier = this.allProductSupplierSelected.selected;
          return false;
        }
        if (this.suppliers.length == this.selectedProductSupplierList.length && this.branchList.length > 1)
          this.allProductSupplierSelected.select();
          this.allSelectToggleModel.isAllSelectedProductSupplier = this.allProductSupplierSelected.selected ;
          break;
      }
      default: {
        break;
      }
    }

  }

  /* Method to reset dearch filters */
  resetSearchFilter() {
    this.productSearchParameter = new ProductSearchParameter();
    this.appPagination.resetPagination();
    if (this.isAdvanceSearch) {
      this.productDateSearch.setEmptyDateFilter();
    }
    this.productSearchParameter.FromCreationDate = null;
    this.productSearchParameter.ToCreationDate = null;
    this.isAdvanceSearch = false;

    setTimeout(() => {
      if (this.branchSelect) {
        this.branchSelect.options.forEach((item: MatOption) => {
          if (item.viewValue == "All")
            this.allSelectToggleModel.isAllSelectedBranch = true;
          item.select();
        });
      }
      this.searchAllProducts();
    }, 400);
  }

  //reset the favourite view to the default
  onResetFavouriteView() {
    const _dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Reset_Messages.reset_Title_Msg,
        header: this.messages.Reset_Messages.reset_Msg_Generic,
        description: this.messages.Reset_Messages.reset_Msg_Undone,
        isALertIcon: true,
      },
    });
    _dialogRef.componentInstance.confirmDelete.subscribe((isYes: boolean) => {
      if (isYes) {
        // this._httpService.save(CustomerApi.resetFavouriteView, {}).subscribe(
        //   (data) => {
        //     if (data && data.MessageCode > 0) {
        //       this._messageService.showSuccessMessage(
        //         this.messages.Success.Reset_Fav_View
        //       );
        //       this.showDropDownGrid = false;
        //       this.getFavouriteView();
        //     } else {
        //       this._messageService.showErrorMessage(
        //         this.messages.Error.Get_Error.replace("{0}", "Favourite View")
        //       );
        //       this.showDropDownGrid = false;
        //     }
        //   },

        // );
        AuthService.deleteFavViewProduct();
        this._messageService.showSuccessMessage(this.messages.Success.Reset_Fav_View);
        this.showDropDownGrid = false;
        this.getFavouriteView();
      }
    });
  }

  // set the drop down values according to the branches
  filterDropDownAccordingToBranch(selectedBranchesList) {
    if (this.isAdvanceSearch) {
      this.suppliers = [];
      this.brands = [];
      this.productCategories = [];

      this.selectedProductCategoryList = [];
      this.selectedProductBrandList = [];
      this.selectedProductSupplierList = [];

      selectedBranchesList?.forEach((element) => {
        this.copySuppliers?.forEach((supplier) => {
          supplier.BranchIDs.forEach((branchID) => {
            if (branchID == element.BranchID) {
              this.suppliers.push(supplier);
            }
          });
        });
        this.copyBrands?.forEach((brands) => {
          brands.BranchIDs?.forEach((branchID) => {
            if (branchID == element.BranchID) {
              this.brands.push(brands);
            }
          });
        });

        this.copyProductCategories?.forEach((brands) => {
          brands.BranchIDs?.forEach((branchID) => {
            if (branchID == element.BranchID) {
              this.productCategories.push(brands);
            }
          });
        });
      });

      this.suppliers = this.suppliers.filter(
        (element, i) => i === this.suppliers.indexOf(element)
      );
      this.brands = this.brands.filter(
        (element, i) => i === this.brands.indexOf(element)
      );
      this.productCategories = this.productCategories.filter(
        (element, i) => i === this.productCategories.indexOf(element)
      );

      setTimeout(() => {
        if (this.selectProductCategory) {
          if(this.productCategories.length > 1){
          this.selectProductCategory.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedProductCategory = true;
            item.select();
          });
        }
        }

        if (this.selectProductBrand) {
          if(this.brands.length >1){
          this.selectProductBrand.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedProductBrand = true;
            item.select();
          });
        }
      }
        if (this.selectProductSupplier) {
          if(this.suppliers.length > 1){
          this.selectProductSupplier.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedProductSupplier = true;
            item.select();
          });
        }
      }
      }, 200);
    }
  }

  onEditProduct(productID, typeID, branchID){
    if(typeID == this.enum_AppSourceType.OnSite){
      this.onRouteUrl(branchID);
    } else{
      this._router.navigate([`../product/products/details/` + productID])
    }
  }

  onRouteUrl(branchID) {
    const token: string = AuthService.getAccessToken();
    if (token) {
      let url = this.env.coreUrl + this.companyID + '/' + branchID + '/' + ENU_CoreUrlType.Product + '/' + 0 + '/' + ProductModulePagesEnum.Products + '/' + true + '/&?ID=' + token
      window.open(url);
    }
  }

  //Edit Price Dialog
  onEditPrice(productID: number, classficationID) {
    const _dialog = this._dialog.open(ProductPriceComponent, {
      disableClose: true,
      panelClass: "full-width-popup",
      data: { productID: productID, branchList: this.branchList, areaName: this.productAreaEnum.EditPricing, classficationID: classficationID }
    });
    _dialog.componentInstance.isClose.subscribe((isClose: boolean) => {
      if (isClose) {
        this.searchAllProducts();
      }
    })


  }

  getProductPricingList(productID: number) {
    return new Promise<boolean>((resolve, reject) => {
      this._httpService.get(ProductApi.getDetail + productID).subscribe(data => {
        if (data && data.Result != null) {
          let productDetail = data.Result;

          this._dialog.open(ViewProductComponent, {
            disableClose: true,
            panelClass: "full-width-popup",
            data: { ...productDetail }
          });
        }
        else {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace('{0}', 'Product')
          );
        }
      });
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Product')
        );
      }
    })
  }

  //view detail of Product
  openProductDetailDialog(productID) {
    this._httpService.get(ProductApi.getDetail + productID).subscribe(data => {
      if (data && data.Result != null) {
        let productDetail = data.Result;

        this._dialog.open(ViewProductComponent, {
          disableClose: true,
          panelClass: "full-width-popup",
          data: { ...productDetail }
        });
      }
      else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Product')
        );
      }
    });
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace('{0}', 'Product')
      );
    }
  }

  openVariantDialog(productID: number, IsProductVariantGenerated: boolean, classficationID: number) {
    const _dialog = this._dialog.open(ProductVariantComponent, {
      disableClose: true,
      panelClass: "full-width-popup",
      data: { productID: productID, isProductVariantGenerate: IsProductVariantGenerated, classficationID: classficationID }

    });

    _dialog.componentInstance.isClose.subscribe((isClose: boolean) => {
      if (isClose) {
        this.searchAllProducts();
      }
    })


  }

  openInventoryDialog(productID: number, classficationID: number) {
    const _dialog = this._dialog.open(EditInventoryComponent, {
      disableClose: true,
      panelClass: "full-width-popup",
      data: { productID: productID, branchList: this.branchList, StockAdjustmentReasons: this.StockAdjustmentReasons, classficationID: classficationID }
    });
    _dialog.componentInstance.isClose.subscribe((isClose: boolean) => {
      if (isClose) {
        this.searchAllProducts();
      }
    })
  }


  //#endregion


}
