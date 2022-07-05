
/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from "@angular/core";
/********************* Material:Refference ********************/
import { MatPaginator } from "@angular/material/paginator";
import { MatDatepicker } from "@angular/material/datepicker";
import { SubscriptionLike as ISubscription } from "rxjs";
/********************** Services & Models *********************/
/* Services */
import { HttpService } from "@services/app.http.service";
import { MessageService } from "@services/app.message.service";
/********************** Component *********************/
/* Models */
/**********************  Common *********************/
import { Messages } from "@app/helper/config/app.messages";
import { AppPaginationComponent } from "@app/shared-pagination-module/app-pagination/app.pagination.component";
import { ViewCustomerDetail } from "../view/view.customer.detail.component";
import { MatDialogService } from "@app/services/mat.dialog.service";
import { Customer_SearchFundamental_DropDowns, CustomerType, FavouriteViewColumnNameString, ENU_CoreUrlType, ENU_FavouriteViewColumnName } from "@app/helper/config/app.enums";
import { MatOption } from "@angular/material/core";
import { CustomerApi } from "@app/helper/config/app.webapi";
import { Configurations } from "@app/helper/config/app.config";
import { EnterpriseCustomerListSearchViewModel } from "@app/models/CustomerSearchFundamental";
import { DateToDateFromComponent } from '@app/shared-components/app-datePicker/dateto.datefrom.component';
import { MemberDetail } from "../models/customers.models";
import { HideAndShowFavouriteViewColumn } from "@app/models/favourite-view-show-hide-model";
import { DeleteConfirmationComponent } from "@app/application-dialog-module/delete-dialog/delete.confirmation.component";
import { LoaderService } from "@app/services/app.loader.service";
import { AuthService } from "@app/helper/app.auth.service";
import { DataSharingService } from "@app/services/data.sharing.service";
import { MatSelect } from "@angular/material/select";
import { AllSelectToggleModel } from "@app/models/all-select-toggle-model";
import { ENU_Permission_Module, ENU_Permission_Customer } from "@app/helper/config/app.module.page.enums";
import { environment } from "environments/environment.prod";

@Component({
  selector: 'app-customer-search',
  templateUrl: './search.customer.component.html'
})
export class SearchCustomerComponent implements OnInit {
  // #region Local members
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  @ViewChild("appPagination") appPagination: AppPaginationComponent;
  @ViewChild('branchSelect') branchSelect: MatSelect;
  @ViewChild('membershipSelect') membershipSelect: MatSelect;
  @ViewChild('membershipStatusSelect') membershipStatusSelect: MatSelect;
  @ViewChild('enquiredMembershipSelect') enquiredMembershipSelect: MatSelect;
  @ViewChild('leadStatusTypeSelect') leadStatusTypeSelect: MatSelect;
  @ViewChild('enquirySourceTypeSelect') enquirySourceTypeSelect: MatSelect;
  @ViewChild("customerDateSearch") customerDateSearch: DateToDateFromComponent;
  @ViewChild('allSelectedBranch') public allSelectedBranch: MatOption;
  @ViewChild('allSelectedMembership') public allSelectedMembership: MatOption;
  @ViewChild('allSelectedMembershipStatus') public allSelectedMembershipStatus: MatOption;
  @ViewChild('allSelectedEnquiredMembership') public allSelectedEnquiredMembership: MatOption;
  @ViewChild('allSelectedLeadStatusType') public allSelectedLeadStatusType: MatOption;
  @ViewChild('allSelectedEnquirySourceType') public allSelectedEnquirySourceType: MatOption;
  /***********Local*********/
  maxDate: Date = new Date();
  dateToPlaceHolder: string = "Select Customer Created Date";
  dateFromPlaceHolder: string = "Select Customer Created Date";

  /* Messages */
  messages = Messages;
  hasSuccess: boolean = false;
  hasError: boolean = false;
  isAdvanceSearch: boolean = false;
  successMessage: string;
  errorMessage: string;
  public isDataExists: boolean = false;
  isAllSelectedBranch: boolean = false;
  canResetEnable: boolean = false;
  isEmailValid: boolean;
  memberShipStartDate: any;
  memberShipEndDate: any;
  /* Collection And Models */
  selectedBranchesList: Array<any> = [];
  selectedTypeList: Array<any> = [];
  selectedMembershipList: Array<any> = [];
  selectedMembershipStatusList: Array<any> = [];
  selectedEnquiryList: Array<any> = [];
  selectedEnquiredMembershipList: Array<any> = [];
  selectedCustomerType: Array<any> = [];
  selectedEnquirySourceTypeList: Array<any> = [];
  BranchList: Array<any> = [];
  EnquiredMembershipList: Array<any> = [];
  copyEnquiredMembershipList: Array<any> = [];
  LeadStatusTypeList: Array<any> = [];
  EnquirySourceTypeList: Array<any> = [];
  customerTypeList: Array<any> = Configurations.CustomerTypeList;
  membershipList: Array<any> = [];
  copyMembershipList: Array<any> = [];
  membershipStatusTypeList: Array<any> = [];
  selectedFavouriteViewColumn: Array<number> = [];
  public customer_SearchFundamental_DropDowns = Customer_SearchFundamental_DropDowns;
  enterpriseCustomerListSearchParams: EnterpriseCustomerListSearchViewModel = new EnterpriseCustomerListSearchViewModel();
  enterpriseCustomerList: Array<any> = [];
  toggleStatuses: any[] = [];
  customerDetail: MemberDetail = new MemberDetail();
  hideAndShowFavouriteViewColumn: HideAndShowFavouriteViewColumn = new HideAndShowFavouriteViewColumn();
  allSelectToggleModel: AllSelectToggleModel = new AllSelectToggleModel();
  /*** Favourite View */
  favouriteViewColumnNameList: Array<any> = Configurations.FavouriteViewColumnNameList;
  dummyFavouriteViewColumnNameList: Array<any> = Configurations.FavouriteViewColumnNameList;
  ENU_FavouriteViewColumnName = ENU_FavouriteViewColumnName;
  deepCopyFavouriteViewColumnNameList: Array<any> = []
  customerType = CustomerType;
  /* Dialog Reference */
  deleteDialogRef: any;
  viewDialogRef: any;
  isCustomerNameOrderASC: boolean = true;
  startDateSortASC: boolean = undefined;
  customerTypeSortASC: boolean = undefined;
  membershipStatusSortASC: boolean = undefined;
  endDateSortASC: boolean = undefined;
  sortOrder: string;
  isSearchByPageIndex: boolean = false;
  currentDate: any;
  showDropDownGrid: boolean;
  staticMinimumDateValue: string = "0001-01-01T00:00:00Z";
  sortOrder_ASC = Configurations.SortOrder_ASC;
  sortOrder_DESC = Configurations.SortOrder_DESC;
  companyIdSubscription: ISubscription;
  BranchPermissioSubscription: ISubscription;
  companyID: number;
  isEditAllow: boolean;
  permissionBranchList: any;
  isView: boolean;
  env:any;
  // #endregion

  constructor(
    private _httpService: HttpService,
    private _dialog: MatDialogService,
    private _loaderService: LoaderService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,
    private _authService: AuthService,


  ) {
    this.deepCopyFavouriteViewColumnNameList = JSON.parse(JSON.stringify(this.favouriteViewColumnNameList));
    this.env = environment.environment;
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.memberShipStartDate = this.currentDate;
    this.memberShipEndDate = this.currentDate;
    this.getCustomerSearchfundamentals();
    this.getFavouriteView();
    this.setPermissions();

    this.companyIdSubscription = this._dataSharingService.companyID.subscribe(companyID => {
      this.companyID = companyID;
    });

    this.BranchPermissioSubscription = this._dataSharingService.branchPermission.subscribe(branches => {
      if (branches) {
        this.permissionBranchList = branches;
      }
    })
  }

  ngAfterViewInit() {
    this.customerDateSearch?.setEmptyDateFilter();

  }
  ngOnDestroy() {
    this.companyIdSubscription.unsubscribe();
    this.BranchPermissioSubscription.unsubscribe();
  }
  //#region Events
  onOpenCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  onMembershipStartDateChange(date: Date) {
    this.memberShipStartDate = date;
    this.memberShipEndDate = date;
    this.enterpriseCustomerListSearchParams.MembershipStartDate = this.memberShipStartDate;
    this.enterpriseCustomerListSearchParams.MembershipEndDate = this.memberShipStartDate
    this.setNotSelectedDate();
    this.validateDate();
  }

  onMembershipEndDateChange(date: Date) {
    this.memberShipEndDate = date;
    this.enterpriseCustomerListSearchParams.MembershipEndDate = this.memberShipEndDate;
    this.setNotSelectedDate();
  }

  setPermissions() {
    this.isEditAllow = this._authService.hasPagePermission(ENU_Permission_Module.Customer, ENU_Permission_Customer.Customer_Save);
    this.isView = this._authService.hasPagePermission(ENU_Permission_Module.Customer, ENU_Permission_Customer.Customer_View);
  }

  setNotSelectedDate() {
    if (this.memberShipStartDate == undefined && this.memberShipEndDate) {
      this.memberShipStartDate = this.memberShipEndDate;
    }
    if (this.memberShipEndDate == undefined && this.memberShipStartDate) {
      this.memberShipEndDate = this.currentDate;
    }
  }

  validateDate() {
    if (this.memberShipStartDate > this.memberShipEndDate) {
      this.memberShipEndDate = this.memberShipStartDate;
    }
  }
  /* Receive date for Customer Search Parameter */
  reciviedDate($event) {
    this.enterpriseCustomerListSearchParams.DateFrom = $event.DateFrom;
    this.enterpriseCustomerListSearchParams.DateTo = $event.DateTo;
  }

  //#region Methods
  /* Method to get Customer Search Fundamentals */
  getCustomerSearchfundamentals() {
    this._httpService.get(CustomerApi.getCustomerFundamentals).subscribe((data) => {
      this.membershipList = data.Result.MembershipList ? data.Result.MembershipList : [];
      this.copyMembershipList = this.membershipList;

      this.membershipStatusTypeList = data.Result.MembershipStatusList ? data.Result.MembershipStatusList : [];
      this.BranchList = data.Result.BranchList ? data.Result.BranchList : [];
      this.EnquiredMembershipList = data.Result.EnquiredMembershipList ? data.Result.EnquiredMembershipList : [];
      this.copyEnquiredMembershipList = this.EnquiredMembershipList
      this.LeadStatusTypeList = data.Result.LeadStatusTypeList ? data.Result.LeadStatusTypeList : [];
      this.EnquirySourceTypeList = data.Result.EnquirySourceTypeList ? data.Result.EnquirySourceTypeList : [];
      setTimeout(() => {
        if (this.branchSelect) {
          this.branchSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedBranch = true;
            item.select()
          });
        }
        this.getAllCustomers();
      }, 400);
    });
  }
  /* Method to search all the customers */
  searchAllCustomers() {
    this.appPagination.paginator.pageIndex = 0;
    this.appPagination.pageNumber = 1;
    this.getAllCustomers();
  }
  /* Method to get all the customers */
  getAllCustomers() {
    this.mapCustomerSearchFilters();
    let customerSearch = JSON.parse(JSON.stringify(this.enterpriseCustomerListSearchParams));
    customerSearch.PageNumber = this.appPagination.pageNumber;
    customerSearch.PageSize = this.appPagination.pageSize;
    this._httpService.save(CustomerApi.getAllCustomer, customerSearch).subscribe(
      (data) => {
        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.enterpriseCustomerList = data.Result;
          this.enterpriseCustomerList.forEach(x => {
            x.EnterpriseCustomerListDetailVM.forEach(element => {
              element.collapse = false;
              element.EnterpriseCustomerMembershipStatusVM =  element.EnterpriseCustomerMembershipStatusVM.filter(Membership => Membership.MembershipName.length !== 0 && Membership.MembershipStartDate !== this.staticMinimumDateValue && Membership.MembershipEndDate !== this.staticMinimumDateValue) || [];
            });

          })
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          } else {
            this.appPagination.totalRecords = 0;
          }
        } else {
          this.enterpriseCustomerList = [];
          this.appPagination.totalRecords = 0;
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Customer")
        );
      }
    );
  }
  //#endregion
  /* Method to reset dearch filters */
  resetSearchFilter() {
    this.customerDateSearch?.setEmptyDateFilter();
    this.enterpriseCustomerListSearchParams = new EnterpriseCustomerListSearchViewModel();
    this.enterpriseCustomerListSearchParams.MembershipStartDate = null;
    this.enterpriseCustomerListSearchParams.MembershipEndDate = null;
    this.memberShipStartDate = null;
    this.memberShipEndDate = null;
    this.appPagination.resetPagination();
    this.isAdvanceSearch = false;
    this.resetSelectedDropDowns();
    setTimeout(() => {
      if (this.branchSelect) {
        this.branchSelect.options.forEach((item: MatOption) => {
          if (item.viewValue == "All")
            this.allSelectToggleModel.isAllSelectedBranch = true;
          item.select()
        });
      }
      this.getAllCustomers();
    }, 400);
  }

  GetMembershipListByBranch(branchIDs: any) {
    this._httpService.save(CustomerApi.getMembershipListByBranch, { BranchIDs: branchIDs }).subscribe((data) => {
      if (data.Result && data.Result.MembershipList.length > 0 || data.Result.EnquiredMembershipList.length > 0) {
        this.membershipList = data.Result.MembershipList ? data.Result.MembershipList : [];
        this.EnquiredMembershipList = data.Result.EnquiredMembershipList ? data.Result.EnquiredMembershipList : [];
        setTimeout(() => {
          if (this.membershipSelect) {
            this.membershipSelect.options.forEach((item: MatOption) => {
              if (item.viewValue == "All") {
                this.allSelectToggleModel.isAllSelectedMembership = true;
              }

              item.select()
            });
          }
          if (this.enquiredMembershipSelect) {
            this.enquiredMembershipSelect.options.forEach((item: MatOption) => {
              if (item.viewValue == "All") {
                this.allSelectToggleModel.isAllSelectedEnquiredMembership = true;
              }

              item.select()
            });
          }
        }, 200);

      } else {
        this.membershipList = this.copyMembershipList;
        this.EnquiredMembershipList = this.copyEnquiredMembershipList;
        if (this.membershipSelect) {
          this.membershipSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedMembership = true;
            item.select()
          });
        }
        if (this.enquiredMembershipSelect) {
          this.enquiredMembershipSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedEnquiredMembership = true;
            item.select()
          });
        }
      }

    });
  }
  resetSelectedDropDowns() {
    this.selectedBranchesList = [];
    this.selectedCustomerType = [];
    this.selectedEnquiredMembershipList = [];
    this.selectedEnquiryList = [];
    this.selectedEnquirySourceTypeList = [];
    this.selectedMembershipList = [];
    this.selectedMembershipStatusList = [];
    this.selectedTypeList = [];
  }
  mapCustomerSearchFilters() {
    if (this.allSelectToggleModel.isAllSelectedBranch) {
      this.enterpriseCustomerListSearchParams.BranchIDs = null;
    }
    else {
      this.enterpriseCustomerListSearchParams.BranchIDs = this.selectedBranchesList.map(x => x.BranchID).join(",");
    }
    if (this.isAdvanceSearch) {
      if (!this.allSelectToggleModel.isAllSelectedMembershipStatus) {
        this.enterpriseCustomerListSearchParams.MembershipStatusTypeIDs = this.selectedMembershipStatusList.map(x => x.MembershipStatusTypeID).join(",");
      }
      else {
        this.enterpriseCustomerListSearchParams.MembershipStatusTypeIDs = null;
      }

      if (!this.allSelectToggleModel.isAllSelectedMembership) {
        this.enterpriseCustomerListSearchParams.MembershipIDs = this.selectedMembershipList.map(x => x.MembershipID).join(",");
      }
      else {
        this.enterpriseCustomerListSearchParams.MembershipIDs = null;
      }
      if (!this.allSelectToggleModel.isAllSelectedEnquiredMembership) {
        this.enterpriseCustomerListSearchParams.EnquiredMembershipIDs = this.selectedEnquiredMembershipList.map(x => x.MembershipID).join(",");
      }
      else {
        this.enterpriseCustomerListSearchParams.EnquiredMembershipIDs = null;
      }

      if (!this.allSelectToggleModel.isAllSelectedLeadStatusType) {
        this.enterpriseCustomerListSearchParams.MembershipEnquiryStatusTypeIDs = this.selectedEnquiryList.map(x => x.LeadStatusTypeID).join(",");
      }
      else {
        this.enterpriseCustomerListSearchParams.MembershipEnquiryStatusTypeIDs = null;
      }
      if (!this.allSelectToggleModel.isAllSelectedEnquirySource) {
        this.enterpriseCustomerListSearchParams.SourceTypeIDs = this.selectedEnquirySourceTypeList.map(x => x.EnquirySourceTypeID).join(",");
      }
      else {
        this.enterpriseCustomerListSearchParams.SourceTypeIDs = null;
      }
    }
  }
  /* Method to receive the pagination from the Paginator */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getAllCustomers();
    }
  }

  toggleAdvanceSearch() {
    this.isAdvanceSearch = !this.isAdvanceSearch;
    setTimeout(() => {
      if (this.isAdvanceSearch) {
        if (this.membershipSelect) {
          this.membershipSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedMembership = true;
            item.select()
          });
        }
        if (this.enquiredMembershipSelect) {
          this.enquiredMembershipSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedEnquiredMembership = true;
            item.select()
          });
        }

        if (this.enquirySourceTypeSelect) {
          this.enquirySourceTypeSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedEnquirySource = true;
            item.select()
          });
        }
        if (this.leadStatusTypeSelect) {
          this.leadStatusTypeSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedLeadStatusType = true;
            item.select()
          });
        }
        if (this.membershipStatusSelect) {
          this.membershipStatusSelect.options.forEach((item: MatOption) => {
            if (item.viewValue == "All")
              this.allSelectToggleModel.isAllSelectedMembershipStatus = true;
            item.select()
          });
        }
      }
    }, 200);

  }
  //for all  selection
  toggleAllSelection(type) {
    switch (type) {
      case this.customer_SearchFundamental_DropDowns.Branch: {
        this.selectedBranchesList = [];
        if (this.allSelectedBranch.selected) {
          this.BranchList.forEach(branch => {
            this.selectedBranchesList.push(branch);
          });

          setTimeout(() => {
            this.allSelectedBranch.select();
            this.allSelectToggleModel.isAllSelectedBranch = true;
            let branchIDs = null;
            this.GetMembershipListByBranch(branchIDs);
          }, 100)
        }
        break;
      }
      case this.customer_SearchFundamental_DropDowns.MembershipStatus: {
        this.selectedMembershipStatusList = [];
        if (this.allSelectedMembershipStatus.selected) {
          this.membershipStatusTypeList.forEach(membershipStatus => {
            this.selectedMembershipStatusList.push(membershipStatus);
          });

          setTimeout(() => {
            this.allSelectedMembershipStatus.select();
            this.allSelectToggleModel.isAllSelectedMembershipStatus = true;
          }, 100)
        }
        break;
      }
      case this.customer_SearchFundamental_DropDowns.Membership: {
        this.selectedMembershipList = [];
        if (this.allSelectedMembership.selected) {
          this.membershipList.forEach(membership => {
            this.selectedMembershipList.push(membership);
          });

          setTimeout(() => {
            this.allSelectedMembership.select();
            this.allSelectToggleModel.isAllSelectedMembership = true;
          }, 100)
        }
        break;
      }
      case this.customer_SearchFundamental_DropDowns.EnquiredMembership: {
        this.selectedEnquiredMembershipList = [];
        if (this.allSelectedEnquiredMembership.selected) {
          this.EnquiredMembershipList.forEach(membership => {
            this.selectedEnquiredMembershipList.push(membership);
          });

          setTimeout(() => {
            this.allSelectedEnquiredMembership.select();
            this.allSelectToggleModel.isAllSelectedEnquiredMembership = true;
          }, 100)
        }
        break;
      }
      case this.customer_SearchFundamental_DropDowns.EnquiryStatus: {
        this.selectedEnquiryList = [];
        if (this.allSelectedLeadStatusType.selected) {
          this.LeadStatusTypeList.forEach(LeadStatusType => {
            this.selectedEnquiryList.push(LeadStatusType);
          });

          setTimeout(() => {
            this.allSelectedLeadStatusType.select();
            this.allSelectToggleModel.isAllSelectedLeadStatusType = true;
          }, 100)
        }
        break;
      }
      case this.customer_SearchFundamental_DropDowns.EnquirySource: {
        this.selectedEnquirySourceTypeList = [];
        if (this.allSelectedEnquirySourceType.selected) {
          this.EnquirySourceTypeList.forEach(LeadStatusType => {
            this.selectedEnquirySourceTypeList.push(LeadStatusType);
          });

          setTimeout(() => {
            this.allSelectedEnquirySourceType.select();
            this.allSelectToggleModel.isAllSelectedBranch = true;
          }, 100)
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
      case this.customer_SearchFundamental_DropDowns.Branch: {
        let branchIDs = this.selectedBranchesList.map(x => x.BranchID).join(',');
        this.GetMembershipListByBranch(branchIDs);
        if (this.BranchList && this.allSelectedBranch && this.allSelectedBranch.selected) {
          this.allSelectedBranch.deselect();
          this.allSelectToggleModel.isAllSelectedBranch = this.allSelectedBranch.selected;
          return false;
        }
        if (this.BranchList.length == this.selectedBranchesList.length && this.BranchList.length > 1)
          this.allSelectedBranch.select();
        this.allSelectToggleModel.isAllSelectedBranch = this.allSelectedBranch.selected;
        break;
      }
      case this.customer_SearchFundamental_DropDowns.MembershipStatus: {
        if (this.membershipStatusTypeList && this.allSelectedMembershipStatus && this.allSelectedMembershipStatus.selected) {
          this.allSelectedMembershipStatus.deselect();
          this.allSelectToggleModel.isAllSelectedMembershipStatus = this.allSelectedMembershipStatus.selected;
          return false;
        }
        if (this.membershipStatusTypeList.length == this.selectedMembershipStatusList.length && this.membershipStatusTypeList.length > 1)
          this.allSelectedMembershipStatus.select();
        this.allSelectToggleModel.isAllSelectedMembershipStatus = this.allSelectedMembershipStatus.selected;
        break;
      }
      case this.customer_SearchFundamental_DropDowns.Membership: {
        if (this.membershipList && this.allSelectedMembership && this.allSelectedMembership.selected) {
          this.allSelectedMembership.deselect();
          this.allSelectToggleModel.isAllSelectedMembership = this.allSelectedMembership.selected;
          return false;
        }
        if (this.membershipList.length == this.selectedMembershipList.length && this.membershipList.length > 1)
          this.allSelectedMembership.select();
        this.allSelectToggleModel.isAllSelectedMembership = this.allSelectedMembership.selected;
        break;
      }
      case this.customer_SearchFundamental_DropDowns.EnquiredMembership: {
        if (this.EnquiredMembershipList && this.allSelectedEnquiredMembership && this.allSelectedEnquiredMembership.selected) {
          this.allSelectedEnquiredMembership.deselect();
          this.allSelectToggleModel.isAllSelectedEnquiredMembership = this.allSelectedEnquiredMembership.selected;
          return false;
        }
        if (this.EnquiredMembershipList.length == this.selectedEnquiredMembershipList.length && this.EnquiredMembershipList.length > 1)
          this.allSelectedEnquiredMembership.select();
        this.allSelectToggleModel.isAllSelectedEnquiredMembership = this.allSelectedEnquiredMembership.selected;
        break;
      }
      case this.customer_SearchFundamental_DropDowns.EnquiryStatus: {
        if (this.LeadStatusTypeList && this.allSelectedLeadStatusType && this.allSelectedLeadStatusType.selected) {
          this.allSelectedLeadStatusType.deselect();
          this.allSelectToggleModel.isAllSelectedLeadStatusType = this.allSelectedLeadStatusType.selected;
          return false;
        }
        if (this.LeadStatusTypeList.length == this.selectedEnquiryList.length && this.LeadStatusTypeList.length > 1)
          this.allSelectedLeadStatusType.select();
        this.allSelectToggleModel.isAllSelectedLeadStatusType = this.allSelectedLeadStatusType.selected;
        break;
      }
      case this.customer_SearchFundamental_DropDowns.EnquirySource: {
        if (this.EnquirySourceTypeList && this.allSelectedEnquirySourceType && this.allSelectedEnquirySourceType.selected) {
          this.allSelectedEnquirySourceType.deselect();
          this.allSelectToggleModel.isAllSelectedEnquirySource = this.allSelectedEnquirySourceType.selected;
          return false;
        }
        if (this.EnquirySourceTypeList.length == this.selectedEnquirySourceTypeList.length && this.EnquirySourceTypeList.length > 1)
          this.allSelectedEnquirySourceType.select();
        this.allSelectToggleModel.isAllSelectedEnquirySource = this.allSelectedEnquirySourceType.selected;
        break;
      }
      default: {
        break;
      }
    }
  }
  /* Method to change Sorting */
  changeSorting(favouriteViewColumnName?: any) {
    let sortIndex: number;
    if (favouriteViewColumnName === FavouriteViewColumnNameString.Name) {
      sortIndex = 1;
    }
    if (favouriteViewColumnName === FavouriteViewColumnNameString.DateCreated) {
      sortIndex = 2;
    }
    this.enterpriseCustomerListSearchParams.SortIndex = sortIndex;
    if (sortIndex == 1) {
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.enterpriseCustomerListSearchParams.SortOrder = this.sortOrder;
        this.getAllCustomers();
      } else {
        this.sortOrder = this.sortOrder_ASC;
        this.enterpriseCustomerListSearchParams.SortOrder = this.sortOrder;
        this.getAllCustomers();
      }
    }
    if (sortIndex == 2) {
      if (this.sortOrder == this.sortOrder_ASC) {
        this.sortOrder = this.sortOrder_DESC;
        this.enterpriseCustomerListSearchParams.SortOrder = this.sortOrder;
        this.getAllCustomers();
      } else {
        this.sortOrder = this.sortOrder_ASC;
        this.enterpriseCustomerListSearchParams.SortOrder = this.sortOrder;
        this.getAllCustomers();
      }
    }
  }
  openCustomerDetailDialog(customerDetail) {
    let url = customerDetail.EnterpriseCustomerListDetailVM[0].CustomerTypeID == CustomerType.Member ? CustomerApi.getMemberDetail : customerDetail.EnterpriseCustomerListDetailVM[0].CustomerTypeID === CustomerType.Lead ? CustomerApi.getLeadDetail : CustomerApi.getClientDetail;
    this._httpService.get(url + customerDetail.CustomerID).subscribe(data => {
      if (data && data.Result != null) {
        this.customerDetail = data.Result;

        this._dialog.open(ViewCustomerDetail, {
          disableClose: true,
          data: { ...this.customerDetail, ...customerDetail }
        });
      }
      else {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace('{0}', 'Customer detail')
        );
      }
    });
    (error) => {
      this._messageService.showErrorMessage(
        this.messages.Error.Get_Error.replace('{0}', 'Customer detail')
      );
    }
  }
  // #endregion

  //#region  Fav View
  mapFavView() {
    this.favouriteViewColumnNameList.forEach(customerView => {
      if (customerView.selected) {
        this.selectedFavouriteViewColumn.push(customerView.FavouriteViewColumnIndex);
      }
    });
  }
  /* Method to set the toggle  Fav View*/
  togglePersonalGrid(show: boolean) {
    setTimeout(() => {
      this.showDropDownGrid = show;

    });
  }

  getFavouriteView() {
    let favouriteViews = [];
    this._httpService.get(CustomerApi.getFavouriteView).subscribe(
      (data) => {
        if (data.Result && data.Result.length > 0) {
          this.dummyFavouriteViewColumnNameList = [];
          favouriteViews = data.Result;
          this.canResetEnable = favouriteViews && favouriteViews.length > 0 ? true : false;
          favouriteViews = favouriteViews.sort((a, b) => parseFloat(a.FavouriteViewColumnIndex) - parseFloat(b.FavouriteViewColumnIndex));
          this.dummyFavouriteViewColumnNameList = favouriteViews;
          this.hideAndShowFavouriteViewColumn = new HideAndShowFavouriteViewColumn();
          this.hideAndShowFavouriteViewColumns(favouriteViews, false);
        }
        else {
          this.canResetEnable = false;
          this.favouriteViewColumnNameList = [];
          this.favouriteViewColumnNameList = JSON.parse(JSON.stringify(this.deepCopyFavouriteViewColumnNameList));
          this.dummyFavouriteViewColumnNameList = Configurations.DefaultViewColumnNameList;
          this.hideAndShowFavouriteViewColumn = new HideAndShowFavouriteViewColumn();
          this.hideAndShowFavouriteViewColumns(this.dummyFavouriteViewColumnNameList, false);
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Favourite View")
        );
      }
    );
  }

  hideAndShowFavouriteViewColumns(favouriteViewColumnNameList: Array<any>, isFromApply?: boolean) {
    if (favouriteViewColumnNameList && favouriteViewColumnNameList.length > 0) {

      favouriteViewColumnNameList.forEach(x => {
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipName) {
          this.hideAndShowFavouriteViewColumn.isMembershipNameColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipStatus) {
          this.hideAndShowFavouriteViewColumn.isMembershipStatusColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipStartDate) {
          this.hideAndShowFavouriteViewColumn.isMembershipStartDateColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipEndDate) {
          this.hideAndShowFavouriteViewColumn.isMembershipEndDateColumn = true
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.EnquiryStatus) {
          this.hideAndShowFavouriteViewColumn.isEnquiryStatusColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Name) {
          this.hideAndShowFavouriteViewColumn.isNamedColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Branch) {
          this.hideAndShowFavouriteViewColumn.isBranchedColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Type) {
          this.hideAndShowFavouriteViewColumn.isCustomerTypeColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Email) {
          this.hideAndShowFavouriteViewColumn.isEmailColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Mobile) {
          this.hideAndShowFavouriteViewColumn.isMobileColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.DateCreated) {
          this.hideAndShowFavouriteViewColumn.isCreatedDateColumn = true;
          x.isDefault = true;
        }
        if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.EnquiredMembership) {
          this.hideAndShowFavouriteViewColumn.isEnquiredMembershipColumn = true;
          x.isDefault = true;
        }
        let isMembershipColumns = x.FavouriteViewColumnName.includes('Membership') && !x.FavouriteViewColumnName.includes('EnquiredMembership');
        if (isMembershipColumns) {
          if (!isFromApply) {
            x.selected = true;
          }
          x.isCustomerInfoColumn = false;
          x.isCustomerEniquryColumn = true;
        }
        let isEnquiryColumns = x.FavouriteViewColumnName.includes('Enquir');
        if (isEnquiryColumns) {
          if (!isFromApply) {
            x.selected = true;
          }
          x.isCustomerInfoColumn = false;
          x.isCustomerEniquryColumn = true;
        }
        if (!isMembershipColumns && !isEnquiryColumns) {
          if (!isFromApply) {
            x.selected = true;
          }
          x.isCustomerInfoColumn = true;
        }
      });
      if (favouriteViewColumnNameList.length === this.favouriteViewColumnNameList.length) {
        this.favouriteViewColumnNameList.forEach(x => {
          x.selected = true;
        })
      }
      else {
        for (let i = 0; i < this.favouriteViewColumnNameList.length; i++) {
          for (let j = 0; j < favouriteViewColumnNameList.length; j++) {
            if (this.favouriteViewColumnNameList[i].FavouriteViewColumnIndex === favouriteViewColumnNameList[j].FavouriteViewColumnIndex) {
              this.favouriteViewColumnNameList[i].selected = favouriteViewColumnNameList[j].selected;
            }
            if (this.favouriteViewColumnNameList[i].FavouriteViewColumnName === FavouriteViewColumnNameString.DateCreated && !this.hideAndShowFavouriteViewColumn.isCreatedDateColumn) {
              this.favouriteViewColumnNameList[i].selected = false;
            }
            if (this.favouriteViewColumnNameList[i].FavouriteViewColumnName === FavouriteViewColumnNameString.Mobile && !this.hideAndShowFavouriteViewColumn.isMobileColumn) {
              this.favouriteViewColumnNameList[i].selected = false;
            }
            if (this.favouriteViewColumnNameList[i].FavouriteViewColumnName === FavouriteViewColumnNameString.Email && !this.hideAndShowFavouriteViewColumn.isEmailColumn) {
              this.favouriteViewColumnNameList[i].selected = false;
            }
          }
        }
      }
    }
  }

  onSaveAndApplyFavView(isFromApply) {
    this.mapFavView();
    let selectedFavouriteViewColumns: any = this.selectedFavouriteViewColumn.map(x => x).join(',');
    this._httpService.save(CustomerApi.saveFavouriteView, { favouriteViewColumnIndexes: selectedFavouriteViewColumns }).subscribe(
      (data) => {
        if (data && data.MessageCode === 1) {
          this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Favourite View"));
          this.showDropDownGrid = false;
          this.selectedFavouriteViewColumn = [];
          this.getFavouriteView();
        }
        else {
          this._messageService.showErrorMessage(
            this.messages.Error.Save_Error.replace("{0}", "Favourite View")
          );
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Save_Error.replace("{0}", "FavouriteView")
        );
      }
    );
  }

  onApply(isFromApply: boolean) {
    this._loaderService.show();
    setTimeout(() => {
      this.temporaryFavView();
      this._loaderService.hide();
      this.canResetEnable = true;
    }, 1000);

  }

  temporaryFavView() {
    this.dummyFavouriteViewColumnNameList = [...this.favouriteViewColumnNameList];
    this.favouriteViewColumnNameList.forEach(x => {
      if (x.selected == false) {
        this.dummyFavouriteViewColumnNameList.splice(this.dummyFavouriteViewColumnNameList.indexOf(x), 1);
      }
    });
    this.favouriteViewColumnNameList.forEach(x => {
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipName) {
        this.hideAndShowFavouriteViewColumn.isMembershipNameColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipStatus) {
        this.hideAndShowFavouriteViewColumn.isMembershipStatusColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipStartDate) {
        this.hideAndShowFavouriteViewColumn.isMembershipStartDateColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.MembershipEndDate) {
        this.hideAndShowFavouriteViewColumn.isMembershipEndDateColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.EnquiryStatus) {
        this.hideAndShowFavouriteViewColumn.isEnquiryStatusColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Name) {
        this.hideAndShowFavouriteViewColumn.isNamedColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Branch) {
        this.hideAndShowFavouriteViewColumn.isBranchedColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Type) {
        this.hideAndShowFavouriteViewColumn.isCustomerTypeColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Email) {
        this.hideAndShowFavouriteViewColumn.isEmailColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.Mobile) {
        this.hideAndShowFavouriteViewColumn.isMobileColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.DateCreated) {
        this.hideAndShowFavouriteViewColumn.isCreatedDateColumn = x.selected;
      }
      if (x.FavouriteViewColumnName === FavouriteViewColumnNameString.EnquiredMembership) {
        this.hideAndShowFavouriteViewColumn.isEnquiredMembershipColumn = x.selected;
      }
    });
    this.showDropDownGrid = false;
  }

  onResetFavouriteView() {
    const _dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Reset_Messages.reset_Title_Msg, header: this.messages.Reset_Messages.reset_Msg_Generic,
        description: this.messages.Reset_Messages.reset_Msg_Undone,
        isALertIcon: true
      }
    });
    _dialogRef.componentInstance.confirmDelete.subscribe((isYes: boolean) => {
      if (isYes) {
        this._httpService.save(CustomerApi.resetFavouriteView, {}).subscribe(
          (data) => {
            if (data && data.MessageCode > 0) {
              this._messageService.showSuccessMessage(this.messages.Success.Reset_Fav_View);
              this.showDropDownGrid = false;
              this.getFavouriteView();
            }
            else {
              this._messageService.showErrorMessage(
                this.messages.Error.Get_Error.replace("{0}", "Favourite View")
              );
              this.showDropDownGrid = false;
            }
          },
          (error) => {
            this._messageService.showErrorMessage(
              this.messages.Error.Get_Error.replace("{0}", "Favourite View")
            );
            this.showDropDownGrid = false;
          }
        );
      }
    })
  }
  //check branch base permission
  isBranchPermission(branchId: number) {
    let isBranch;
    for (let index = 0; index < this.permissionBranchList.length; index++) {
      if (this.permissionBranchList[index].BranchID == branchId && this.permissionBranchList[index].IsBranchPermission == true) {
        isBranch = true;
        break;
      } else {
        isBranch = false;
      }
    }
    return isBranch;
  }

  onRouteUrl(customerDetail: any) {
    const token: string = AuthService.getAccessToken();
    if (token) {

      let url = this.env.coreUrl + this.companyID + '/' + customerDetail.BranchID + '/' + ENU_CoreUrlType.Customer + '/' + customerDetail.CustomerID + '/' + customerDetail.CustomerTypeID + '/' + false + '/&?ID=' + token
      window.open(url);
    }
  }
  /*** Toggle Memberships */
  /* Method to set the toggle Statuses */
  setToggleStatuses(i: number) {
    let toggledIndex = i;
    return toggledIndex;
  }

  /* Method to toggle the membership length and view */
  isMembershipToggle: boolean = false;
  toggledIndex: number;
  onToggleClick(i: number, j: number) {
    this.setToggleStatuses(i);
    this.toggledIndex = i;
    if(j >=0){
      this.enterpriseCustomerList[i].EnterpriseCustomerListDetailVM[j].collapse = !this.enterpriseCustomerList[i].EnterpriseCustomerListDetailVM[j].collapse;
    }else{
      this.enterpriseCustomerList[i].EnterpriseCustomerListDetailVM[0].collapse = false;
    }

  }

  //#endregion
}
