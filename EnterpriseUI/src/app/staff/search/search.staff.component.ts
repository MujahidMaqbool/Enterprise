/********************* Angular References ********************/
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

/********************* Material Reference ********************/
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
/********************* Services & Models ********************/
/* Services */
import { MessageService } from 'src/app/services/app.message.service';

/* Models*/
import { StaffView, EnterpriseStaffListViewModel, EnterpriseStaffSearchViewModel, StaffAllSelectToggleModel } from 'src/app/staff/models/staff.models';

/********************** Common ***************************/
import { Configurations } from 'src/app/helper/config/app.config'
import { StaffApi } from 'src/app/helper/config/app.webapi'
import { HttpService } from 'src/app/services/app.http.service';
import { Messages } from 'src/app/helper/config/app.messages';
import { DeleteConfirmationComponent } from 'src/app/application-dialog-module/delete-dialog/delete.confirmation.component';

/********************** Components *********************************/
import { ViewStaffDetail } from 'src/app/staff/view-staff-detail/view.staff.detail.component';
import { AuthService } from 'src/app/helper/app.auth.service';
// import { ENU_Permission_Module, ENU_Permission_Staff } from 'src/app/helper/config/app.module.page.enums';
import { DataSharingService } from 'src/app/services/data.sharing.service';
// import { SessionService } from 'src/app/helper/app.session.service';
import { AppPaginationComponent } from 'src/app/shared-pagination-module/app-pagination/app.pagination.component';
import { AssignRolePopupComponent } from '../assign-role/assign.role.component';
import { CustomerType, ENU_CoreUrlType, ENU_DateFormatName, ENU_StaffSearchDropDown } from 'src/app/helper/config/app.enums';
//import { AbstractGenericComponent } from 'src/app/shared/helper/abstract.generic.component';
import { MatOption } from '@angular/material/core';
import { DateToDateFromComponent } from 'src/app/shared-components/app-datePicker/dateto.datefrom.component';
import { SubscriptionLike as ISubscription } from "rxjs";
import { ENU_Permission_Module, ENU_Permission_Branch, ENU_Permission_Setup, ENU_Permission_Staff } from 'src/app/helper/config/app.module.page.enums';
import { MatSelect } from '@angular/material/select';
import { environment } from 'src/environments/environment.prod';

@Component({
    selector: 'search-staff',
    templateUrl: './search.staff.component.html'
})

export class SearchStaffComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("appPagination") appPagination: AppPaginationComponent;
    @ViewChild('allSelectedStaffPositions') private allSelectedStaffPosition: MatOption;
    @ViewChild('allSelectedStaffRoles') private allSelectedStaffRole: MatOption;
    @ViewChild('allSelectedStaffBranches') private allSelectedStaffBranches: MatOption;
    @ViewChild('branchSelect') branchSelect: MatSelect;
    @ViewChild('staffPositionSelect') staffPositionSelect: MatSelect;
    @ViewChild('staffRoleSelect') staffRoleSelect: MatSelect;

    @ViewChild("staffDateSearch") staffDateSearch: DateToDateFromComponent;
    dateToPlaceHolder: string = "Select Staff Created Date";
    dateFromPlaceHolder: string = "Select Staff Created Date";
    // #region Local Members
    panelOpenState: boolean = false;
    isDataExists: boolean = false;
    isStaffSaveAllowed: boolean = false;
    isStaffActivityAllowed: boolean = false;
    isSuperAdminLoggedIn: boolean;
    loggedInStaffId: number;
    env:any;
    selectedStaffPositions: Array<any> = [];
    selectedStaffRoles: Array<any> = [];
    selectedStaffBranches: Array<any> = [];
    copyRoleList: Array<any> = [];
    staffAllSelectToggleModel: StaffAllSelectToggleModel = new StaffAllSelectToggleModel();
    companyIdSubscription: ISubscription;
    BranchPermissioSubscription: ISubscription;
    companyID: number;

    /* Messages */
    hasSuccess: boolean = false;
    hasError: boolean = false;
    errorMessage: string;
    successMessage: string;
    messages = Messages;

    /* Models Refences */
    staffSearchParameter = new EnterpriseStaffSearchViewModel();
    staffSearchFilterParams: EnterpriseStaffSearchViewModel = new EnterpriseStaffSearchViewModel();
    EnterpriseStaffListViewModel = new EnterpriseStaffListViewModel();
    staffSearchFundamentals: any;
    staffPositionList: any;
    staffRoleList: any;
    staffBranchList: any;
    statusList: any;
    staffGridDataObj: any[];
    staffViewDetailDataObj: StaffView;

    /* Configurations */
    ENU_StaffSearchDropDown = ENU_StaffSearchDropDown;

    sortIndex: number = 1;
    sortOrder_ASC: string = Configurations.SortOrder_ASC;
    sortOrder_DESC: string = Configurations.SortOrder_DESC;
    sortOrder: string;
    postionSortOrder: string;
    isPositionOrderASC: boolean = undefined;
    isStaffNameOrderASC: boolean = true;
    isSearchByPageIndex: boolean = false;

    loggedInStaffIdSubscription: SubscriptionLike;
    dateFormat: string = "";
    showAdvancedSearchFiels: boolean = false;
    showAdvancedSearchLabel: string = "Advance Search";
    strPositionObj: string;
    strRoleObj: string;
    strBranchObj: string;

    positionIds: any = [];
    branchIds: any = [];
    roleIds: any = [];
    shortedArry: any = [];
    isEditAllow: boolean;
    BranchList: any;
    isView: boolean;

    // #endregion 

    constructor(
        private _authService: AuthService,
        private _staffService: HttpService,
        private _staffActionDialog: MatDialogService,
        private _messageService: MessageService,
        private _dataSharingService: DataSharingService,
    ) {
        //super();
        this.env = environment.environment;
    }

    ngOnInit() {
        this.getBranchDatePattern();
        this.setPermissions();
        this.sortOrder = this.sortOrder_ASC;
        this.postionSortOrder = this.sortOrder_ASC;
        this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
            this.companyID = companyID;
        })
    }
   
    ngAfterViewInit() {
        this.setModelForSearch();
        this.BranchPermissioSubscription = this._dataSharingService.branchPermission.subscribe(branches => {
            if (branches) {
                this.BranchList = branches;
            }
        })
        this.getStaff();
    }

    async getBranchDatePattern() {
        this.getStaffSearchFundamentals();
    }

    ngOnDestroy() {
        this.companyIdSubscription.unsubscribe();
        this.BranchPermissioSubscription.unsubscribe();
        //this.loggedInStaffIdSubscription.unsubscribe();
    }
    // #region Events


    changeSorting(sortIndex: number) {
        this.sortIndex = sortIndex;
        if (sortIndex == 1) {
            this.isPositionOrderASC = undefined;
            if (this.sortOrder == this.sortOrder_ASC) {
                this.sortOrder = this.sortOrder_DESC;
                this.isStaffNameOrderASC = false;
                this.getStaff();
            }
            else {
                this.sortOrder = this.sortOrder_ASC;
                this.getStaff();
                this.isStaffNameOrderASC = true;
            }
        }

        if (sortIndex == 2) {
            this.isStaffNameOrderASC = undefined;
            if (this.postionSortOrder == this.sortOrder_ASC) {
                this.isPositionOrderASC = true;
                this.sortOrder = this.sortOrder_ASC;
                this.getStaff(); this.postionSortOrder = this.sortOrder_DESC
            }
            else {
                this.sortOrder = this.sortOrder_DESC;
                this.getStaff();
                this.isPositionOrderASC = false;
                this.postionSortOrder = this.sortOrder_ASC;
            }
        }
    }

   
    openDialog() {
        this._staffActionDialog.open(ViewStaffDetail, {
            disableClose: true,
            data: this.staffViewDetailDataObj,
        });

    }

    getStaffRoleFundamental(staff: any) {
        this.shortedArry = [];
        let params = {
            RoleName: "",
            IsActive: true,
            PageNumber: 1,
            PageSize: 500
        }
        let url = StaffApi.getStaffRole + '?RoleName=' + params.RoleName + '&IsActive=' + params.IsActive + '&PageNumber=' + params.PageNumber + '&PageSize=' + params.PageSize;
        this._staffService.get(url)
            .subscribe(data => {
                if (data.Result && data.Result.length > 0) {
                    let obj: any = {};
                    data.Result.forEach(element => {
                        obj = {};
                        obj.RoleID = Number(element.RoleID),
                            obj.RoleName = element.RoleName;
                        obj.staffID = staff.StaffID;
                        obj.enterpriseRoleID = staff.EnterpriseRoleID > 0 && staff.EnterpriseRoleID != null ? staff.EnterpriseRoleID : 0;
                        obj.allowLogin = staff.AllowLogin;
                        this.shortedArry.push(obj);
                    });
                    this.openAssignRolePopup(this.shortedArry);
                }
                else {
                    this._messageService.showErrorMessage(data.MessageText);
                }
            });
    }

    openAssignRolePopup(roleList: any) {
        const dialogRef = this._staffActionDialog.open(AssignRolePopupComponent, {
            disableClose: true,
            data: roleList
        });

        dialogRef.componentInstance.roleSaved.subscribe((isSaved: boolean) => {
            if (isSaved) this.getStaff();
            dialogRef.close();
        })
    }

    // #endregion   

    // #region methods

    getStaffSearchFundamentals() {
       
        this._staffService.get(StaffApi.staffFundamental)
            .subscribe(data => {
                this.staffSearchFundamentals = data.Result;
                this.staffPositionList = data.Result.StaffPositionList;
                this.staffRoleList = data.Result.RoleList;
                this.copyRoleList = data.Result.RoleList;
                this.staffBranchList = data.Result.Branches
                this.statusList = data.Result.StatusList;
                this.GetRoleListByBranch(null);
                this.setDefaultDrowdown();
                setTimeout(() => {
                    if (this.branchSelect) {
                        this.branchSelect.options.forEach((item: MatOption) => {
                            if (item.viewValue == "All")
                                this.staffAllSelectToggleModel.isAllSelectedBranch = true;
                            item.select()
                        });
                    }
                    if (this.staffPositionSelect) {
                        this.staffPositionSelect.options.forEach((item: MatOption) => {
                            if (item.viewValue == "All")
                                this.staffAllSelectToggleModel.isAllSelectedPosition = true;
                            item.select()
                        });
                    }


                    this.getStaff();
                }, 400);
            },
                err => {
                    this._messageService.showErrorMessage(this.messages.Error.Dropdowns_Load_Error);
                });
    }

    getStaff() {
        this.setModelForSearch();
      //  let customerSearch = JSON.parse(JSON.stringify(this.staffSearchFilterParams));
        this._staffService.save(StaffApi.getAll, this.staffSearchFilterParams)
            .subscribe(data => {
                this.isDataExists = data.Result != null && data.Result.length > 0 ? true : false;
                if (this.isDataExists) {
                    if (data.Result.length > 0) {
                        this.staffGridDataObj = data.Result;
                        // this.staffGridDataObj.forEach(element => {
                        //     element.Detail.forEach(innerElement => {
                        //         innerElement.IsBranch = this.isBranchPermission(innerElement.BranchID);

                        //     });
                        // });
                        this.appPagination.totalRecords = data.TotalRecord;
                    }
                   
                }
                else {       
                    this.staffGridDataObj= [];                 
                    this.appPagination.totalRecords = 0;
                }
                (error) => {
                    this._messageService.showErrorMessage(
                      this.messages.Error.Get_Error.replace("{0}", "Staff")
                    );
                }
            });
    }

    setModelForSearch() {
        this.staffSearchFilterParams.StaffName = this.staffSearchFilterParams.StaffName != "" && this.staffSearchFilterParams.StaffName != null ? this.staffSearchFilterParams.StaffName : "";
        this.staffSearchFilterParams.Email = this.staffSearchFilterParams.Email != "" && this.staffSearchFilterParams.Email != undefined ? this.staffSearchFilterParams.Email : "";
       // this.staffSearchFilterParams.allowLogin = this.staffSearchFilterParams.allowLogin;
        this.staffSearchFilterParams.SortIndex = this.sortIndex;
        this.staffSearchFilterParams.SortOrder = this.sortOrder;
        this.staffSearchFilterParams.PageSize = this.appPagination.pageSize;
        this.staffSearchFilterParams.PageNumber = this.appPagination.pageNumber;

        if (!this.staffAllSelectToggleModel.isAllSelectedPosition) {
            this.staffSearchFilterParams.Positions = this.selectedStaffPositions.map(x => x.StaffPositionID).join(",");
        }
        else {
            this.staffSearchFilterParams.Positions = null;
        }

        if (!this.staffAllSelectToggleModel.isAllSelectedRoll) {
            this.staffSearchFilterParams.Roles = this.selectedStaffRoles.map(x => x.RoleID).join(",");
        }
        else {
            this.staffSearchFilterParams.Roles = null;
        }

        if (!this.staffAllSelectToggleModel.isAllSelectedBranch) {
            this.staffSearchFilterParams.Branches = this.selectedStaffBranches.map(x => x.BranchID).join(",");
        }
        else {
            this.staffSearchFilterParams.Branches = null;
        }
    }

    staffSearch() {
       // this.setModelForSearch();      
   
        this.getStaff();
        this.appPagination.paginator.pageIndex = 0;
        this.appPagination.pageNumber = 1;
    }

    /* Method to receive the pagination from the Paginator */
    reciviedPagination(pagination: boolean) {
        if (pagination) {
            this.getStaff();
        }
    }

    /* Receive date for Customer Search Parameter */
    reciviedDate($event) {
        this.staffSearchFilterParams.DateFrom = $event.DateFrom;
        this.staffSearchFilterParams.DateTo = $event.DateTo;
    }


    stafAdvacnedfSearch() {
        this.showAdvancedSearchFiels = !this.showAdvancedSearchFiels;
        if (this.showAdvancedSearchFiels) {
           
           // this.showAdvancedSearchLabel = "Close Advance Search";
            setTimeout(() => {
                if (this.staffRoleSelect) {
                    this.staffRoleSelect.options.forEach((item: MatOption) => {
                        if (item.viewValue == "All")
                            this.staffAllSelectToggleModel.isAllSelectedRoll = true;
                        item.select()
                    });
                }
            }, 100);

        } else {
           
           // this.showAdvancedSearchLabel = "Advance Search";
        }
        this.staffSearchFilterParams.allowLogin = null;
    }

    resetStaffSearchFilters() {
        this.staffSearchFilterParams = new EnterpriseStaffSearchViewModel()
        this.staffSearchFilterParams.StaffName = "";
        this.staffSearchFilterParams.Email = "";
        this.staffSearchFilterParams.Branches = null;
        this.staffSearchFilterParams.Positions = "";
        this.staffSearchFilterParams.Email = "";
        this.staffSearchFilterParams.allowLogin = null;
        this.selectedStaffBranches = [];
        this.selectedStaffPositions = [];
        this.selectedStaffRoles = [];
        this.showAdvancedSearchFiels = false;
        this.appPagination.resetPagination();
        setTimeout(() => {
            if (this.branchSelect) {
                this.branchSelect.options.forEach((item: MatOption) => {
                    if (item.viewValue == "All")
                        this.staffAllSelectToggleModel.isAllSelectedBranch = true;
                    item.select()
                });
            }
            if (this.staffPositionSelect) {
                this.staffPositionSelect.options.forEach((item: MatOption) => {
                    if (item.viewValue == "All")
                        this.staffAllSelectToggleModel.isAllSelectedPosition = true;
                    item.select()
                });
            }
            if (this.staffRoleSelect) {
                this.staffRoleSelect.options.forEach((item: MatOption) => {
                    if (item.viewValue == "All")
                        this.staffAllSelectToggleModel.isAllSelectedRoll = true;
                    item.select()
                });
            }

            this.getStaff();
        }, 400);
    }

    // deleteStaff(Id: number) {
    //     const deleteDialogRef = this._staffActionDialog.open(DeleteConfirmationComponent, { disableClose: true, data: { header: this.messages.Delete_Messages.Del_Msg_Generic.replace("{0}", "?"), description: this.messages.Delete_Messages.Del_Msg_Undone } });
    //     deleteDialogRef.componentInstance.confirmDelete.subscribe((isConfirmDelete: boolean) => {
    //         if (isConfirmDelete) {
    //             this._staffService.delete(StaffApi.delete + Id)
    //                 .subscribe((res: any) => {
    //                     if (res && res.MessageCode) {
    //                         if (res && res.MessageCode > 0) {
    //                             this._messageService.showSuccessMessage(this.messages.Success.Delete_Success.replace("{0}", "Staff"));
    //                             this.getStaff();
    //                         }
    //                         else if (res && res.MessageCode <= 0) {
    //                             this._messageService.showErrorMessage(this.messages.Error.Staff_Associated_Error.replace("{0}", "Staff"));
    //                             this._messageService.showErrorMessage(res.MessageText);
    //                         }
    //                         else {
    //                             this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Staff"));
    //                         }
    //                     }
    //                 },
    //                     err => { this._messageService.showErrorMessage(this.messages.Error.Delete_Error.replace("{0}", "Staff")); }
    //                 );
    //         }
    //     })
    // }

    viewStaffDetails(staffId: number) {
        this._staffService.get(StaffApi.staffViewByID + staffId)
            .subscribe(
                data => {
                    this.staffViewDetailDataObj = data.Result;
                    this.openDialog();
                },
                err => {
                    this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Staff"));
                });
    }

    // viewStaffDetails() {
    //     this.openDialog();
    // }

    setPermissions() {
        this.isEditAllow = this._authService.hasPagePermission(ENU_Permission_Module.Staff, ENU_Permission_Staff.Staff_Save);
        this.isView = this._authService.hasPagePermission(ENU_Permission_Module.Staff, ENU_Permission_Staff.Staff_View);
    }

    setDefaultDrowdown() {
        this.staffSearchFilterParams.allowLogin = null;
        this.staffSearchFilterParams.Positions = "";
    }

    //#region multi selector staff positions
    onSelectAllStaffPositions(selectedDropdown: number) {
        if (this.ENU_StaffSearchDropDown.staffPosition == selectedDropdown) {
            this.staffSearchFilterParams.Positions = "";
            if (this.allSelectedStaffPosition.selected) {
                this.selectedStaffPositions = [];
                this.staffPositionList.forEach(position => {
                    this.selectedStaffPositions.push(position);
                });
                setTimeout(() => {
                    this.allSelectedStaffPosition.select();
                    this.staffAllSelectToggleModel.isAllSelectedPosition = true;
                }, 100);
            } else {
                this.selectedStaffPositions = [];
                this.allSelectedStaffPosition.deselect();
                this.staffAllSelectToggleModel.isAllSelectedPosition = false;
            }
        } else if (this.ENU_StaffSearchDropDown.StaffRole == selectedDropdown) {
            this.staffSearchFilterParams.Roles = "";
            if (this.allSelectedStaffRole.selected) {
                this.selectedStaffRoles = [];
                this.staffRoleList.forEach(role => {
                    this.selectedStaffRoles.push(role);
                });
                setTimeout(() => {
                    this.allSelectedStaffRole.select();
                    this.staffAllSelectToggleModel.isAllSelectedRoll = true;
                }, 100);
            } else {
                this.selectedStaffRoles = [];
                this.allSelectedStaffRole.deselect();
                this.staffAllSelectToggleModel.isAllSelectedRoll = false;
            }
        } else if (this.ENU_StaffSearchDropDown.StaffBranch == selectedDropdown) {
            this.staffSearchFilterParams.Branches = null;
            if (this.allSelectedStaffBranches.selected) {
                this.selectedStaffBranches = [];
                this.staffBranchList.forEach(branch => {
                    this.selectedStaffBranches.push(branch);
                });
                setTimeout(() => {
                    this.allSelectedStaffBranches.select();
                    this.staffAllSelectToggleModel.isAllSelectedBranch = true;
                    let branchIDs = null;
                  this.GetRoleListByBranch(branchIDs);
                }, 100);
            } else {
                this.selectedStaffBranches = [];
                this.allSelectedStaffBranches.deselect();
                this.staffAllSelectToggleModel.isAllSelectedBranch = false;
            }
        }
    }

    onToggleStaffPositionSelection(selectedValue: any, selectedDropdown: number, index) {
        if (this.ENU_StaffSearchDropDown.StaffBranch == selectedDropdown) {
            let branchIDs = this.selectedStaffBranches.map(x => x.BranchID).join(',');
             this.GetRoleListByBranch(branchIDs);
            if (this.allSelectedStaffBranches && this.allSelectedStaffBranches.selected) {
                this.allSelectedStaffBranches.deselect();
                this.staffAllSelectToggleModel.isAllSelectedBranch = this.allSelectedStaffBranches.selected;
                return;
            }
            if (this.staffBranchList.length == this.selectedStaffBranches.length) {
                this.allSelectedStaffBranches.select();
                this.staffAllSelectToggleModel.isAllSelectedBranch = this.allSelectedStaffBranches.selected;
                return;
            }
        }
        else if (this.ENU_StaffSearchDropDown.staffPosition == selectedDropdown) {
            if (this.allSelectedStaffPosition && this.allSelectedStaffPosition.selected) {
                this.allSelectedStaffPosition.deselect();
                this.staffAllSelectToggleModel.isAllSelectedPosition = this.allSelectedStaffPosition.selected;

                return;
            }
            if (this.staffPositionList.length == this.selectedStaffPositions.length) {
                this.allSelectedStaffPosition.select();
                this.staffAllSelectToggleModel.isAllSelectedPosition = this.allSelectedStaffPosition.selected;

                return;
            }
        }
        else if (this.ENU_StaffSearchDropDown.StaffRole == selectedDropdown) {
            if (this.allSelectedStaffRole && this.allSelectedStaffRole.selected) {
                this.allSelectedStaffRole.deselect();
                this.staffAllSelectToggleModel.isAllSelectedRoll = this.allSelectedStaffRole.selected;
                return;
            }
            if (this.staffRoleList.length == this.selectedStaffRoles.length) {
                this.allSelectedStaffRole.select();
                this.staffAllSelectToggleModel.isAllSelectedRoll = this.allSelectedStaffRole.selected;
                return;
            }
        }




    }
    //check branch base permission
    isBranchPermission(branchId: number) {
        let isBranch;
        for (let index = 0; index < this.BranchList.length; index++) {
            if (this.BranchList[index].BranchID == branchId && this.BranchList[index].IsBranchPermission == true) {
                isBranch = true;
                break;
            } else {
                isBranch = false;
            }
        }
        return isBranch;
    }

    //#region 
    onRoutRrl(staffId: number, BranchID: number) {
        const token: string = AuthService.getAccessToken();
        if (token) {
            let url = this.env.coreUrl + this.companyID + '/' + BranchID + '/' + ENU_CoreUrlType.Staff + '/' + staffId + '/' + 0 + '/' + false + '/&?ID=' + token
            window.open(url);
        }
    }

    GetRoleListByBranch(branchIDs: any) {
        this._staffService.save(StaffApi.GetRoleListByBranch, { BranchIDs: branchIDs }).subscribe((data) => {
            if (data.Result && data.Result.length > 0) {
                this.staffRoleList = data.Result ? data.Result : [];
                setTimeout(() => {
                    if (this.staffRoleSelect) {
                        this.staffRoleSelect.options.forEach((item: MatOption) => {
                            if (item.viewValue == "All") {
                                this.staffAllSelectToggleModel.isAllSelectedRoll = true;
                            }

                            item.select()
                        });
                    }
                }, 200);

            } else {
                this.staffRoleList = this.copyRoleList;
                setTimeout(() => {
                    if (this.staffRoleSelect) {
                        this.staffRoleSelect.options.forEach((item: MatOption) => {
                            if (item.viewValue == "All") {
                                this.staffAllSelectToggleModel.isAllSelectedRoll = true;
                            }
                            item.select()
                        });
                    }
                }, 200);
            }
        });
    }
    // #endregion

}
