import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike as ISubscription } from "rxjs";
import { HttpService } from 'src/app/services/app.http.service';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { MessageService } from 'src/app/services/app.message.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';

import { ViewAttributeComponent } from './view/view.component';
import { SaveAttributeComponent } from './save/save.attribute.component'; 

import { AttributesSearchParams, AttributeViewModel } from '../models/attributes.model';
import { AttributeApi } from 'src/app/helper/config/app.webapi';
import { ApiResponse } from 'src/app/models/common.model';

import { Messages } from 'src/app/helper/config/app.messages';
import { MatPaginator } from '@angular/material/paginator';

import { AppPaginationComponent } from 'src/app/shared-pagination-module/app-pagination/app.pagination.component';

import { DeleteConfirmationComponent } from "src/app/application-dialog-module/delete-dialog/delete.confirmation.component";
import { AuthService } from 'src/app/helper/app.auth.service';

import { Configurations } from 'src/app/helper/config/app.config';
import { ENU_Permission_Module, ENU_Permission_Product } from 'src/app/helper/config/app.module.page.enums';
import { EnumSaleSourceType, ENU_CoreUrlType, ProductModulePagesEnum } from 'src/app/helper/config/app.enums';
import { environment } from "src/environments/environment.prod";


@Component({
  selector: 'app-attributes',
  templateUrl: './search.attributes.component.html'
})
export class AttributesSearchComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  @ViewChild("attName") private _inputElement: ElementRef;
  //Models and Objects
  attributesSearchParams : AttributesSearchParams = new AttributesSearchParams();
  attributeViewDetail: AttributeViewModel = new AttributeViewModel();
  branchList = [];
  attributeList: [];


  // locals
  messages = Messages;
  isDataExists: boolean = false;
  appSourceType  = EnumSaleSourceType;
  companyID: number;
  companyIdSubscription: ISubscription;
  allowedPages = {
    Save_Attribute: false,
    Delete_Attribute: false
  }
  env:any;

  //Sorting
  sortOrder_ASC = Configurations.SortOrder_ASC;
  sortOrder_DESC = Configurations.SortOrder_DESC;
  sortOrder: string;

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

    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    });

    this.setPermission();
    this.getFundamentals();
  }

  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.getAttributeList();
  }

  setPermission() {
    this.allowedPages.Save_Attribute = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Attribute_Save);
    this.allowedPages.Delete_Attribute = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Attribute_Delete);
  }

  focusInput() {
    setTimeout(() => { this._inputElement.nativeElement.focus() }, 900)
  }

   /* Get Search Fundamentals */
   getFundamentals() {
    this._httpService.get(AttributeApi.getFundamental).subscribe(
      (response: ApiResponse) => {
        if (response.MessageCode > 0) {
          this.branchList = response.Result;
        } else {
          this._messageService.showErrorMessage(
            this.messages.Error.Get_Error.replace("{0}", "Attribute")
          );
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Attribute")
        );
      }
    );
  }

  searchAttributeList(){
    this.appPagination.pageNumber = 1;
    this.appPagination.paginator.pageIndex = 0;
    this.getAttributeList();
  }

  /* Get Attribute list */
  getAttributeList() {
    this.attributesSearchParams.AttributeName = this.attributesSearchParams.AttributeName.trim();
    let attributeSearch = JSON.parse(
      JSON.stringify(this.attributesSearchParams)
    );
    attributeSearch.PageNumber = this.appPagination.pageNumber;
    attributeSearch.PageSize = this.appPagination.pageSize;
    this._httpService.get(AttributeApi.getAttributes, attributeSearch).subscribe(
      (data) => {
        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.attributeList = data.Result;
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          } else {
            this.appPagination.totalRecords = 0;
          }
        } else {
          this.attributeList = [];

          this.appPagination.totalRecords = 0;
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Attribute")
        );
      }
    );
  }

    /* change sorting */
    changeSorting(sortIndex: number) {
      this.attributesSearchParams.SortIndex = sortIndex;
      if (sortIndex == 1) {
        if (this.sortOrder == this.sortOrder_ASC) {
          this.sortOrder = this.sortOrder_DESC;
          this.attributesSearchParams.SortOrder = this.sortOrder;
          this.getAttributeList();
        } else {
          this.sortOrder = this.sortOrder_ASC;
          this.attributesSearchParams.SortOrder = this.sortOrder;
          this.getAttributeList();
        }
      }
  
      if (sortIndex == 2) {
        if (this.sortOrder == this.sortOrder_ASC) {
          this.sortOrder = this.sortOrder_DESC;
          this.attributesSearchParams.SortOrder = this.sortOrder;
          this.getAttributeList();
        } else {
          this.sortOrder = this.sortOrder_ASC;
          this.attributesSearchParams.SortOrder = this.sortOrder;
          this.getAttributeList();
        }
      }
    }
  

   /* Method to receive the pagination from the Paginator */
   reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getAttributeList();
    }
  }

   /* Method to reset search filters */
   resetSearchFilter() {
    this.attributesSearchParams = new AttributesSearchParams();
    this.appPagination.resetPagination();
    this.getAttributeList();
  }

  onViewAttribute(productAttributeID: number) { 
    this._httpService.get(AttributeApi.getAttributeByID + productAttributeID).subscribe(data => {
      if (data && data.Result != null) {
        this.attributeViewDetail = data.Result;

        this._dialog.open(ViewAttributeComponent, {
          disableClose: true,
          data: { ...this.attributeViewDetail }
        });
      }
      else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Attribute')
        );
      }
    });
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace('{0}', 'Attribute')
      );
    }
  }

  onAddAttribute(attributeID: any) {
    const _dialog = this._dialog.open(SaveAttributeComponent, {
      disableClose: true,
      data: attributeID
    });
    _dialog.componentInstance.isSaved.subscribe((isSaved: boolean) => {
      if (isSaved) {
        this.getAttributeList();
      }
    });
  }

  onDeleteAttribute(attributeID: number) {

    const deleteDialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true, data: {
        Title: this.messages.Delete_Messages.Confirm_delete, header: this.messages.Delete_Messages.Del_Msg_Heading.replace("{0}", "attribute"),
        description: this.messages.Delete_Messages.Del_Msg_Description.replace("{0}", "attribute"), ButtonText: this.messages.General.Delete
      }
    });
    deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
      if (isConfirmDelete) {
        this._httpService.delete(AttributeApi.deleteAttribute + attributeID)
          .subscribe((res: any) => {
            if (res && res.MessageCode) {
              if (res && res.MessageCode > 0) {
                this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Attribute"));
                this.getAttributeList();
              }
              else if (res && res.MessageCode < 0) {
                this._messageService.showErrorMessage(res.MessageText);
              }
              else {
                this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "attribute"));
              }
            }
          },
            err => {
              this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "attribute"));
            });
      }
    })

}

onRedirectBranchAttribute(attribute:any){
  const token: string = AuthService.getAccessToken();
  if (token) {
    let url = this.env.coreUrl + this.companyID + '/' + attribute.Detail[0].BranchID + '/' + ENU_CoreUrlType.Product + '/' + attribute.AttributeID + '/' + ProductModulePagesEnum.Attribute + '/' + true + '/&?ID=' + token
    window.open(url);
  }
}


}
