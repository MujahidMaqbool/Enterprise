// #region Imports

/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionLike as ISubscription } from "rxjs";

/********************* Material:Refference ********************/
import { MatPaginator } from '@angular/material/paginator';

/**********************  Configurations *********************/
import { BranchApi } from 'src/app/helper/config/app.webapi';
import { ENU_Permission_Module, ENU_Permission_Branch } from 'src/app/helper/config/app.module.page.enums';
import { ENU_CoreUrlType } from 'src/app/helper/config/app.enums';

/********************** Services & Models *********************/
import { AuthService } from 'src/app/helper/app.auth.service';
import { Messages } from 'src/app/helper/config/app.messages';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { BranchList, BranchSearchModel } from '../models/branch.models';

/**********************  Components  *************************/
import { AppPaginationComponent } from 'src/app/shared-pagination-module/app-pagination/app.pagination.component';
import { ViewBranchesComponent } from '../view/view.branches.component';
import { environment } from 'src/environments/environment.prod';
// #endregion


@Component({
  selector: 'app-search-branches',
  templateUrl: './search.branches.component.html',
})
export class BranchesComponent implements OnInit {
    /*********** region Local Members ****/

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;

 /***********Model Reference*********/
    /*********** Collections *********/
  branchList: BranchList[];
  branchSearchList: BranchList[];
  branchSearchModel: BranchSearchModel = new BranchSearchModel;
  companyIdSubscription: ISubscription

  /*********** Local *******************/
  messages = Messages;
  dateFormat: string = "";
  isEditAllow: boolean;
  isViewAllow: boolean;
  companyID: number;
  isDataExists: boolean = false;
  env:any;

  constructor(
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _openDialog: MatDialogService,
    private _dataSharingService: DataSharingService,
    private _authService: AuthService,

  ) {
    this.env = environment.environment;
   }

  ngOnInit(): void {

    this.branchSearchModel.BranchID = null;
    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      if (companyID) {
        this.companyID = companyID;
        this.getFundamentals();
      }
    })
  }

  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.getBranchList();
  }
  // get fundamentals list
  getFundamentals() {

    this._httpService.get(BranchApi.BranchSearchList)
      .subscribe(data => {
        if (data.Result.length > 0) {
          this.branchSearchList = data.Result;
          this._dataSharingService.shareBranchPermission(data.Result);

        }
      },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Branch"));
        }
      );
  }
  // get branch method 
  getBranchList() {

    this.branchSearchModel.PageNumber = this.appPagination.pageNumber;
    this.branchSearchModel.PageSize = this.appPagination.pageSize;

    this._httpService.get(BranchApi.BranchList, this.branchSearchModel)
      .subscribe(data => {
        this.getPermissionWhenBranchIsLoaded();

        this.isDataExists = data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          }
          else { this.appPagination.totalRecords = 0; }
          this.branchList = data.Result;
        } else {
          this.appPagination.totalRecords = data.TotalRecord;
        }
      },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Branch"));
        }
      );
  }

  //call the setpermission method after when home component is loaded
  getPermissionWhenBranchIsLoaded() {
    this._dataSharingService.isBranchLoaded.subscribe(
      async (isLoaded: boolean) => {
        if (isLoaded) {
          this.setPermissions();
        }
      });
  }

  //set persmission for save and view
  setPermissions() {
    this.isEditAllow = this._authService.hasPagePermission(ENU_Permission_Module.Branches, ENU_Permission_Branch.Branch_Save);
    this.isViewAllow = this._authService.hasPagePermission(ENU_Permission_Module.Branches, ENU_Permission_Branch.Branch_View);
  }

  //Received pagination and call get branch method 
  reciviedPagination(pagination: boolean) {
    if (pagination)
      this.getBranchList();
  }

  //Reset all filters
  resetBranchSearchFilter() {
    this.branchSearchModel.BranchID = null;
    this.appPagination.resetPagination();
    this.getBranchList();
  }

  //Search Branches
  searchAllBranches() {
    this.getBranchList();
  }

  //Branch ViewDetail Click
  onViewBranchDetail(branchID: number) {
    this._openDialog.open(ViewBranchesComponent, {
      disableClose: true,
      data: {
        branchID
      }
    });
  }

  //redirect url to core (Branch Edit Case)
  onEditbranch(BranchID: number, CompanyID: number, isView: boolean) {
    const token: string = AuthService.getAccessToken();
    let url = "";
    if (token) {
      url = url = this.env.coreUrl + CompanyID + '/' + BranchID + '/' + ENU_CoreUrlType.Branch + '/' + 0 + '/' + 0 + '/' + isView + '/&?ID=' + token
      window.open(url);
    }
  }

}
