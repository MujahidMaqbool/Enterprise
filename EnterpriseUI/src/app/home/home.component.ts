import { Component, HostListener, OnInit } from "@angular/core";
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from "@angular/router";
import { ApiResponse, CompanyInfo, DD_Branch, StaffInfo } from "@app/models/common.model";
import { AuthService } from "@app/helper/app.auth.service";
import { HttpService } from "@app/services/app.http.service";
import { MessageService } from "@app/services/app.message.service";
import { Messages } from "@app/helper/config/app.messages";
import { ImagesPlaceholder } from "@app/helper/config/app.placeholder";
import { StaffApi, BranchApi } from "@app/helper/config/app.webapi";
import { DataSharingService } from "@app/services/data.sharing.service";
import { ENU_Permission_Module } from "@app/helper/config/app.module.page.enums";
import { SubscriptionLike } from "rxjs";
import { ChangePasswordPopup } from "./change-password/change.password.popup.component";
import { MatDialogService } from "@app/services/mat.dialog.service";
import { environment } from "environments/environment.prod";


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {

  currentBranchSubscription: SubscriptionLike;
  defaultStaffImagePath: string = ImagesPlaceholder.user;
  staffName: string = "User";
  CompanyInfo: CompanyInfo = new CompanyInfo;
  branchInfo: DD_Branch = new DD_Branch;

  StaffInfo: StaffInfo = new StaffInfo;
  staffImagePath: string;
  serverImageAddress: any;
  loadingRouteConfig: boolean;
  showUserMenu: boolean;
  isShowFooter: boolean;
  messages = Messages;
  hasError: boolean;
  errorMessage: string;
  env:any;

  allowedModules = {
    Setup: false,
    Staff: false,
    Customer: false,
    Branch: false,
    Product: false,
  };

  constructor(
    private _messagesService: MessageService,
    private _dataSharingService: DataSharingService,
    private _httpService: HttpService,
    public _router: Router,
    private _messageService: MessageService,
    private _authService: AuthService,
    private _dialog: MatDialogService,

  ) {
    this.env = environment.environment;
    this.getPermissions();
   }

  ngOnInit() {
    this.getStaffInfo();
    this.serverImageAddress = this.env.imageUrl;
    this._router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouteConfig = false;
      }
      // if (event instanceof NavigationEnd) {
      //   this.showFooter();
      // }
    });

    this.getBranchList();


    this.currentBranchSubscription = this._dataSharingService.updateRolePermission.subscribe(
      (isPackageUpdate: boolean) => {
        if (isPackageUpdate) {
          this.getPermissions();
        }
      }
    )

  }
  mobToogle() {
    if (screen.width < 992) {
      document.getElementById('mob-toggle-btn').click();
    }
  }

  onLogout() {
    // will call api when ali raza provide
    AuthService.logout();
    this._router.navigate(["/account/login"]);
    // this._httpService
    //   .save(AccountApi.StaffLogout, null)
    //   .subscribe((response: ApiResponse) => {
    //     if (response.MessageCode === 1) {
    //       AuthService.logout();
    //       this._router.navigate(["/account/login"]);
    //     }
    //   },
    //     err => {
    //       this._messagesService.showErrorMessage(this.messages.Error.LogOut_Error);
    //     });
  }

  toggleUserMenu(show: boolean) {
    setTimeout(() => {
      this.showUserMenu = show;
    });
  }


  getStaffInfo() {
    this._httpService.get(StaffApi.StaffInfo)
      .subscribe(data => {
        if (data.Result) {
          this.CompanyInfo = data.Result.CompanyInfo;
          this.StaffInfo = data.Result.StaffInfo;
          this.branchInfo = data.Result.BranchList[0];
          AuthService.setStaffID(this.StaffInfo.StaffID);
          this.sharedCompanyID(this.CompanyInfo.CompanyID);
          this.sharedCompanyInfo(this.CompanyInfo);
          this.sharedBranchInfo(data.Result.BranchList[0]);
          this.setStaffImage(this.StaffInfo.ImagePath, this.CompanyInfo.CompanyID);
        }
      },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Staff"));
        }
      );
  }

  getBranchList() {
    this._httpService.get(BranchApi.BranchSearchList)
      .subscribe(data => {
        if (data.Result.length > 0) {
          this._dataSharingService.shareBranchPermission(data.Result);
        }
      },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Branch"));
        }
      );
  }

  sharedCompanyID(companyID) {
    this._dataSharingService.shareCompanyID(companyID);
  }
  sharedCompanyInfo(company) {
    this._dataSharingService.shareCompanyInfo(company);
  }
  sharedBranchInfo(branchInfo:DD_Branch) {
    this._dataSharingService.shareCurrentBranch(branchInfo);
  }
  setStaffImage(staffImage: string, companyID) {
    if (staffImage && staffImage.length > 0) {
      if (staffImage.indexOf(".jpg") > 0) {
        this.staffImagePath =
          this.serverImageAddress.replace("{ImagePath}", companyID) + staffImage;
      } else {
        this.staffImagePath = "data:image/jpeg;base64," + staffImage;
      }
    } else {
      this.staffImagePath = this.defaultStaffImagePath;
    }
  }

  setModulePermissions() {
    this.allowedModules.Branch = this.hasModulePermission(ENU_Permission_Module.Branches);
    this.allowedModules.Customer = this.hasModulePermission(ENU_Permission_Module.Customer);
    this.allowedModules.Staff = this.hasModulePermission(ENU_Permission_Module.Staff);
    this.allowedModules.Setup = this.hasModulePermission(ENU_Permission_Module.Setup);
    this.allowedModules.Product = this.hasModulePermission(ENU_Permission_Module.Product);
    this._dataSharingService.shareBranchLoaded(true);
  }

  onChangePassword() {
    this._dialog.open(ChangePasswordPopup, {
      disableClose: true,
    });
    this.toggleUserMenu(false);
  }

  hasModulePermission(moduleId: number) {
    return this._authService.hasModulePermission(moduleId);
  }


  getPermissions() {
    this._httpService
      .get(StaffApi.getEnterpriseStaffPermissions)
      .subscribe((res: ApiResponse) => {
        if (res && res.MessageCode > 0) {
          if (res.Result) {
            this._dataSharingService.sharePackageId(res.Result.PackageID);
            // this.setModulePermissions();
            this._authService.setPermissions(res.Result.ModuleList);
            this.setModulePermissions();
          }else{
            this._messagesService.showErrorMessage(res.MessageText);
          }
        } else {
          this._messagesService.showErrorMessage(res.MessageText);
        }
      });
  }


// when branch change in one tab, branch auto reload and goto home page in change other tabs when user click it
@HostListener('window:focus', ['$event'])
onFocus(event: FocusEvent): void {
  ///if (this.branchList && this.branchList.length > 1) {

  // var bID: number;
  // var dropDownValue = (<HTMLInputElement><any>document?.getElementById("BranchDropDown"))?.value;
  // if (dropDownValue) {
  //   var branchData = dropDownValue.toString().split(':');
  //   bID = Number(branchData[1].toString().trim());
  // } else {
  //   bID = this.branchId;
  // }
  var staffID = Number(AuthService.getStaffID());

  if (this.StaffInfo && this.StaffInfo.StaffID && this.StaffInfo.StaffID !== staffID) {
    this._router.navigate(["/"]);
    setTimeout(() => {
      location.reload();
    }, 100);

  }
  //}
}


}
