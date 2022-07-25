import { Component, Input, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { ProductAreaEnum, ProductClassification } from 'src/app/helper/config/app.enums';
import { Messages } from 'src/app/helper/config/app.messages';
import { DD_Branch, ApiResponse } from 'src/app/models/common.model';
import { ProductBranchPermissionViewModel, ProductVariantBranchViewModel, ProductVariantPackagingViewModel, ProductVariantPricingModel, ProductVariantViewModel, ProductPriceCheckBoxViewModel } from 'src/app/product/models/product.model';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { SubscriptionLike } from 'rxjs';
import { BulkUpdatePriceComponent } from './save/bulk.update.price.component';
import { SavePackagingComponent } from './save/packaging/packaging.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/app.http.service';
import { ProductApi } from 'src/app/helper/config/app.webapi';
import { MessageService } from 'src/app/services/app.message.service';
import { AppPaginationComponent } from 'src/app/shared-pagination-module/app-pagination/app.pagination.component';
import { ENU_Permission_Module, ENU_Permission_Product } from 'src/app/helper/config/app.module.page.enums';
import { AuthService } from 'src/app/helper/app.auth.service';

@Component({
  selector: 'app-product-price',
  templateUrl: './product.price.component.html'
})
export class ProductPriceComponent implements OnInit {

  /***********References*********/
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  @Output() isClose = new EventEmitter<boolean>();
  currentBranchSubscription: SubscriptionLike;

  currencySymbol: string = "";
  /***********Messages*********/
  messages = Messages;

  /***********Enum*********/
  productClassification = ProductClassification;
  productAreaEnum = ProductAreaEnum;

  /***********Models & Lists*********/
  @Input() productVariantPricingModel: ProductVariantPricingModel[] = new Array<ProductVariantPricingModel>();
  @Input() productVariantPackagingVM: ProductVariantPackagingViewModel = new ProductVariantPackagingViewModel();
  productVariantPricingEditList: any[] = [];
  @Input() areaName: number;
  @Input() taxList: any[] = [];
  @Input() measurementUnitList: any[] = [];
  @Input() branchList: ProductBranchPermissionViewModel[] = new Array<ProductBranchPermissionViewModel>();
  @Input() supplierList: any[] = [];
  @Input() variantName: string;
  @Input() variantID: number;
  productVariantViewModel: ProductVariantViewModel = new ProductVariantViewModel();
  productVariantPricingObj: ProductVariantPricingModel = new ProductVariantPricingModel();

  /***********Local Variables*********/
  branchId: number = null;
  searchVariantName: string = "";
  toggleStatuses: any[] = [];
  isDataExists: boolean;
  isBulkUpdate: boolean = false;
  isSelectAll: boolean;
  productVariantBranchIDList: any = [];
  packageDetail: any;
  editPriceListDetailObj: any;
  showProductPricingError: boolean = false;

  allowedPages = {
    Save_Pricing: false,
    Save_Package: false,
  };

  constructor(
    private _dialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,
    public _authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public productobj: any
  ) {

  }

  ngOnInit() {
    this.areaName = this.productobj.areaName;
    this.branchList = this.productobj.branchList;
    this.setPermission();
    this.getFundamental()
    this.getDefaultBranch();
  }

  // set permissions
  setPermission() {
    this.allowedPages.Save_Pricing = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Pricing_Save
    );
    this.allowedPages.Save_Package = this._authService.hasPagePermission(
      ENU_Permission_Module.Product,
      ENU_Permission_Product.Save_Package
    );
  }

  ngAfterViewInit() {
    if (this.productobj.areaName == this.productAreaEnum.EditPricing) {
      this.getProductPricingList();
    }
  }

  ngOnDestroy() {
    this.currentBranchSubscription?.unsubscribe();
  }

  // get branch detail
  async getDefaultBranch() {
    this.currentBranchSubscription =
      this._dataSharingService.currentBranch.subscribe((branch: DD_Branch) => {
        if (branch.BranchID && branch.hasOwnProperty("Currency")) {
          this.currencySymbol = branch.CurrencySymbol;
        }
      });
  }

  onCloseDialog() {
    this.isClose.emit(true);
    this._dialog.close();
  }

  /* Method to toggle the tax length and view */
  onToggleClick(parentIndex, childIndex, subChildIndex, i: number) {
    this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM[subChildIndex].collapse = !this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM[subChildIndex].collapse;
    this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM[subChildIndex].CollapseItemTaxVM = this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM[subChildIndex].ItemTaxVM;
  }

  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getProductPricingList();
    }
  }

  // on select all check boxes
  onSelectAll(event: any) {
    event.target.checked ? this.productVariantPricingEditList.filter(x => x.VariantList.filter(x => x.ProductVariantBranchVM.filter(v => { v.isSelected = true; }))) :
      this.productVariantPricingEditList.filter(x => x.VariantList.filter(x => x.ProductVariantBranchVM.filter(v => { v.isSelected = false; })));
    this.isBulkUpdate = event.target.checked ? true : false;
    event.target.checked ? this.extractProductBranchIdsFromList() : this.productVariantBranchIDList = []
  }


  // on single checkbox select
  onSingleSelect(event: any, parentIndex: number, childIndex: number, subChildIndex: number, ProductVariantBranchID: number) {
    event.target.checked ? this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM[subChildIndex].isSelected = true : this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM[subChildIndex].isSelected = false;
    this.productVariantPricingEditList.some(x => x.VariantList.some(y => y.ProductVariantBranchVM.some(z => this.isBulkUpdate = z.isSelected === true)));
    this.productVariantPricingEditList.every(x => x.VariantList.every(y => y.ProductVariantBranchVM.every(z => this.isSelectAll = z.isSelected === true)));
    if (event.target.checked) {
      this.productVariantBranchIDList.push({ productVariantBranchID: ProductVariantBranchID })
    } else {
      this.productVariantBranchIDList.forEach((item, index) => {
        if (item.productVariantBranchID === ProductVariantBranchID) this.productVariantBranchIDList.splice(index, 1);
      });
    }
  }

  // on bulk update all records or single record
  onBulkUpdate(bulkUpdateType: number, productVariant: any, parentIndex: number, childIndex: number, subChild: number) {
    this.showProductPricingError = false;
    let pricingDetail = new ProductVariantBranchViewModel();
    pricingDetail.PriceCheckBoxVM = new ProductPriceCheckBoxViewModel();
    if (bulkUpdateType == 3) {
      this.getPricingDetail(productVariant).then(isTrue => {
        pricingDetail = this.editPriceListDetailObj;
        pricingDetail.PriceCheckBoxVM = new ProductPriceCheckBoxViewModel();
        this.openBulkUpdateDialog(bulkUpdateType, productVariant, parentIndex, childIndex, subChild, pricingDetail)
      })
    } else {
      this.openBulkUpdateDialog(bulkUpdateType, productVariant, parentIndex, childIndex, subChild, pricingDetail)
    }
  }
  // open bulk update dialog
  openBulkUpdateDialog(bulkUpdateType: any, productVariant: any, parentIndex: number, childIndex: number, subChild: number, pricingDetail: any) {
    let data = {
      taxList: (bulkUpdateType == 1 || bulkUpdateType == 2) ? this.taxList.filter(i => i.BranchID === 0) : this.taxList.filter(i => i.BranchID === pricingDetail.BranchID || i.BranchID === 0),
      supplierList: this.supplierList,
      areaName: this.productAreaEnum.EditPricing,
      pricingDetail: pricingDetail,
      currencySymbol: this.currencySymbol,
      isBulkUpdate: true,
      selectedVariantLength: this.productVariantBranchIDList.length,
      branchName: bulkUpdateType == 3 ? productVariant.BranchName : 'all',
      isShowCheckBox: bulkUpdateType == 3 ? false : true,
      bulkUpdateType: bulkUpdateType,
    }
    const dialogref = this._dialog.open(BulkUpdatePriceComponent, {
      data: data,
      disableClose: true
    });
    dialogref.componentInstance.savePricingModel.subscribe(savePricingModel => {
      let productPrice = this.setModelForSavePricing(bulkUpdateType, savePricingModel, productVariant, parentIndex, childIndex, subChild);
      console.log(productPrice);
      this.savePricingPackage(false, productPrice, productVariant?.ProductID, bulkUpdateType == 1 || bulkUpdateType == 2 ? true : false, savePricingModel.IsPriceAndTaxUpdate);
    });
  }

  // set models for saving pricing
  setModelForSavePricing(bulkUpdateType: any, savePricingModel: any, productVariant: any, parentIndex: number, childIndex: number, subChild: number) {
    let productPrice = new Array<ProductVariantBranchViewModel>();
    if (bulkUpdateType == 1) {
      this.productVariantPricingEditList[0].VariantList.forEach(variantList => {
        variantList.ProductVariantBranchVM.forEach(variant => {
          this.productVariantBranchIDList.forEach(element => {
            if (variant.ProductVariantBranchID == element.productVariantBranchID) {
              let productVariantBranch = new ProductVariantBranchViewModel();
              productVariantBranch.Barcode = savePricingModel.Barcode;
              productVariantBranch.BranchID = variant.BranchID;
              productVariantBranch.BranchName = variant.BranchName;
              productVariantBranch.ItemTaxVM = savePricingModel?.ItemTaxVM;
              productVariantBranch.CollapseItemTaxVM = [];
              if (productVariantBranch.ItemTaxVM && productVariantBranch.ItemTaxVM.length > 0) {
                productVariantBranch.CollapseItemTaxVM.push(productVariantBranch.ItemTaxVM[0]);
              }
              productVariantBranch.Price = savePricingModel.Price;
              productVariantBranch.ProductVariantID = variant.ProductVariantID;
              productVariantBranch.ProductVarientBranchID = variant.ProductVariantBranchID;
              productVariantBranch.ReorderQuantity = savePricingModel.ReorderQuantity;
              productVariantBranch.ReorderThreshold = savePricingModel.ReorderThreshold;
              productVariantBranch.SKU = savePricingModel.SKU;
              productVariantBranch.SupplierCode = savePricingModel.SupplierCode;
              productVariantBranch.SupplierID = savePricingModel.SupplierID;
              productVariantBranch.SupplierName = savePricingModel.SupplierName;
              productVariantBranch.SupplierPrice = savePricingModel.SupplierPrice;
              productVariantBranch.TotalPrice = savePricingModel.TotalPrice;
              productPrice.push(productVariantBranch);
            }
          });
        });
      });
    } else if (bulkUpdateType == 2) {
      this.productVariantPricingEditList[parentIndex].VariantList[childIndex].ProductVariantBranchVM.forEach(variant => {
        let productVariantBranch = new ProductVariantBranchViewModel();
        productVariantBranch.Barcode = savePricingModel.Barcode;
        productVariantBranch.BranchID = variant.BranchID;
        productVariantBranch.BranchName = variant.BranchName;
        productVariantBranch.ItemTaxVM = savePricingModel?.ItemTaxVM;
        productVariantBranch.CollapseItemTaxVM = [];
        if (productVariantBranch.ItemTaxVM && productVariantBranch.ItemTaxVM.length > 0) {
          productVariantBranch.CollapseItemTaxVM.push(productVariantBranch.ItemTaxVM[0]);
        }
        productVariantBranch.Price = savePricingModel.Price;
        productVariantBranch.ProductVariantID = variant.ProductVariantID;
        productVariantBranch.ProductVarientBranchID = variant.ProductVariantBranchID;
        productVariantBranch.ReorderQuantity = savePricingModel.ReorderQuantity;
        productVariantBranch.ReorderThreshold = savePricingModel.ReorderThreshold;
        productVariantBranch.SKU = savePricingModel.SKU;
        productVariantBranch.SupplierCode = savePricingModel.SupplierCode;
        productVariantBranch.SupplierID = savePricingModel.SupplierID;
        productVariantBranch.SupplierName = savePricingModel.SupplierName;
        productVariantBranch.SupplierPrice = savePricingModel.SupplierPrice;
        productVariantBranch.TotalPrice = savePricingModel.TotalPrice;
        productPrice.push(productVariantBranch);
      });
    } else {
      savePricingModel.ProductVariantID = productVariant.ProductVariantID;
      savePricingModel.ProductVarientBranchID = productVariant.ProductVariantBranchID;
      productPrice.push(savePricingModel);
    }
    return productPrice;
  }

  // get signle pricing detail record again ProductVariantID 
  getPricingDetail(productVariant: any) {
    return new Promise<boolean>((resolve, reject) => {
      let param = {
        productID: this.productobj.productID,
        pageNumber: this.appPagination.pageNumber,
        pageSize: this.appPagination.pageSize,
        productVariantBranchID: productVariant.ProductVariantBranchID,
        productVariantID: productVariant.ProductVariantID,
        productVariantName: '',
        branchID: null
      }
      this._httpService.get(ProductApi.getProductPricingDetail, param).subscribe(data => {
        this.isDataExists = data.Result != null && data.Result.length > 0 ? true : false;
        this.editPriceListDetailObj = this.isDataExists ? data.Result[0].ProductVariantBranchVM[0] : null
        resolve(true)
      }),
        (error) => {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace('{0}', 'Pricing')
          );
        }
    })
  }



  // get pricing list 
  getProductPricingList() {
    return new Promise<boolean>((resolve, reject) => {
      let param = {
        productID: this.productobj.productID,
        pageNumber: this.appPagination.pageNumber,
        pageSize: this.appPagination.pageSize,
        productVariantName: this.searchVariantName,
        branchID: this.branchId
      }
      this._httpService.get(ProductApi.getProductPricingDetail, param).subscribe(data => {
        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
            this.productVariantPricingEditList = data.Result;
            // if product have variants product
            this.productVariantPricingEditList = [];
            let productVariantPricing = {
              ProductName: data.Result[0].ProductName,
              ProductVariantID: data.Result[0].ProductVariantID,
              VariantList: data.Result
            }
            this.productVariantPricingEditList.push(productVariantPricing);
            this.productVariantBranchIDList = [];
            this.isBulkUpdate = false;
            this.isSelectAll = false;
          }
          this.productVariantPricingEditList.filter(x => x.VariantList.filter(y => y.ProductVariantBranchVM.forEach(z => {
            z.collapse = true
            z.ItemTaxVM = [];
            z.CollapseItemTaxVM = [];
            var i;
            var j;
            var array = z.TaxIDs.split(',');
            var arrayTaxName = z.Tax.split(',');
            for (i = 0; i < array.length; ++i) {
              var result = this.taxList.find(t => t.TaxID == Number(array[i]));
              if (result) {
                z.ItemTaxVM.push(result)
              }
            }
            // if tax added by branch level
            if (z.TaxIDs != "" && z.Tax != "") {
              for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < arrayTaxName.length; j++) {
                  if (z.ItemTaxVM.filter(x => x.TaxID == array[i]).length == 0) {
                    let TaxObj = {
                      TaxID: array[i],
                      TaxName: arrayTaxName[i]
                    }
                    z.ItemTaxVM.push(TaxObj);
                  }
                  break;
                }
              }
            }
            if (z.ItemTaxVM && z.ItemTaxVM.length > 0) {
              z.CollapseItemTaxVM.push(z.ItemTaxVM[0]);
            }
            // this.setToggleStatuses(100);
          })))
        } else {
          this.appPagination.totalRecords = 0;
          this.productVariantPricingEditList = [];
        }
      },
        (error) => {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace('{0}', 'Pricing')
          );
        });
      this.productVariantBranchIDList = [];
      this.isBulkUpdate = false;
      this.isSelectAll = false;
    })
  }

  // get package detail by product variant id
  getPackaegDetail(productVariantID: number) {
    return new Promise<boolean>((resolve, reject) => {
      this._httpService.get(ProductApi.getProductPackagingDetail + productVariantID).subscribe(data => {
        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        this.packageDetail = [];
        this.packageDetail = data.Result
        resolve(true);
      });
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Package Detail')
        );
        reject();
      }
    })
  }

  // get fundamental 
  getFundamental() {
    return new Promise<boolean>((resolve, reject) => {
      this._httpService.get(ProductApi.getSaveFundamentals).subscribe(
        (response: ApiResponse) => {
          if (response.MessageCode > 0) {
            //this.brandList = response.Result.BrandDDVM;
            this.branchList = response.Result.BranchDDVM;
            this.supplierList = response.Result.SupplierDDVM;
            this.taxList = response.Result.TaxDDVM;
            this.measurementUnitList = response.Result.MeasurementUnitDDVM;
            resolve(true)
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
    })
  }
  // on package 
  onSavePackaging(productVariant: any) {
    if (productVariant == null) {
      productVariant = new ProductVariantPackagingViewModel()
      this.openPackDialog(productVariant);
    } else {
      this.getPackaegDetail(productVariant.ProductVariantID).then(isTrue => {
        if (isTrue) {
          this.openPackDialog(productVariant);
        }
      });
    }
  }

  // open dialog for packaging
  openPackDialog(productVariant: any) {
    let data = {
      measurementUnitList: this.measurementUnitList,
      pcakagingDetail: this.packageDetail,
    }
    const dialogref = this._dialog.open(SavePackagingComponent, {
      data: data,
      disableClose: false
    });
    dialogref.componentInstance.savePackagingModel.subscribe(savePackagingModel => {
      if (savePackagingModel) {
        if (this.areaName === this.productAreaEnum.EditPricing) {
          savePackagingModel.ProductVariantID = productVariant.ProductVariantID,
            savePackagingModel.WeightUnitID = savePackagingModel.WeightUnitID,
            savePackagingModel.DimensionUnitID = savePackagingModel.DimensionUnitID,
            this.savePricingPackage(true, savePackagingModel, productVariant == null || productVariant == undefined ? this.productobj.productID : productVariant.ProductID);
        }
        this.productVariantPackagingVM = savePackagingModel;
      }
    });
  }

  // save package or bulk update single and multiple records
  savePricingPackage(isPackage: boolean, savePackagingModel: any, productID: number, isBulkUpdate: boolean = false, IsPriceAndTaxUpdate: boolean = false) {
    let param = {
      productID: productID,
      isBulkUpdate: isBulkUpdate,
      IsPriceAndTaxUpdate: IsPriceAndTaxUpdate,
      productVariantBranchVM: !isPackage ? savePackagingModel : null,
      productVariantPackagingVM: isPackage ? savePackagingModel : null
    }
    this._httpService.save(ProductApi.updatePricingAndPackaging, param).subscribe((response: ApiResponse) => {
      if (response.MessageCode > 0) {
        this.isSelectAll = false;
        this.productVariantBranchIDList = [];
        this.getProductPricingList();
        this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace('{0}', isPackage ? 'Package' : 'Pricing'));
      }
      else {
        if (!isPackage) {
          this._messageService.showErrorMessage(response.MessageText);
        } else {
          this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace('{0}', 'Package'));
        }
      }
    },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Pricing')
        );
      }
    );

  }
  /* Method to set the toggle Statuses */
  setToggleStatuses(length: number) {
    for (let i = 0; i < length; i++) {
      this.toggleStatuses[i] = {
        collapse: true
      };
    }
  }

  // extract productVariantBranchID from list
  extractProductBranchIdsFromList() {
    this.productVariantBranchIDList = [];
    this.productVariantPricingEditList.filter(x => x.VariantList.filter(x => x.ProductVariantBranchVM.filter(v => { v.isSelected = true; })))
    this.productVariantPricingEditList.filter(x => x.VariantList.filter(branch => branch.ProductVariantBranchVM.forEach(br => {
      this.productVariantBranchIDList.push({ productVariantBranchID: br.ProductVariantBranchID });
    })))
  }

}
