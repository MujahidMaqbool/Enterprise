// #region Imports

/********************** Angular Refrences *********************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';

/**********************  Configurations *********************/
import { Messages } from '@app/helper/config/app.messages';
import { BranchApi, RewardProgramApi } from '@app/helper/config/app.webapi';
import { EnumSaleSourceType, ENU_Reward_Action_Progress } from '@app/helper/config/app.enums';
import { ENU_Permission_Module, ENU_Permission_Setup } from '@app/helper/config/app.module.page.enums';


/********************** Services & Models *********************/
import { ApiResponse } from '@app/models/common.model';
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { AuthService } from '@app/helper/app.auth.service';
import { MatDialogService } from '@app/services/mat.dialog.service';
import { RewardProgramList, RewardProgramSearchParameter } from '../models/reward-program.model';
import { BranchListRewardProgram } from '@app/branch/models/branch.models';

/**********************  Components  *************************/
import { AppPaginationComponent } from '@app/shared-pagination-module/app-pagination/app.pagination.component';
import { RewardProgramDelete } from '../delete-Reward-Program-Dialog/reward.program.delete.dialog.component';
import { RewardViewComponent } from '../view/view.component';
import { AlertConfirmationComponent } from '@app/application-dialog-module/confirmation-dialog/alert.confirmation.component';


// #endregion

@Component({
  selector: 'app-reward-program-search',
  templateUrl: './reward.program.search.component.html'
})
export class SearchRewardProgramComponent implements OnInit {
  /*********** region Local Members ****/
  @ViewChild("appPagination") appPagination: AppPaginationComponent;

  /* Messages */
  messages = Messages;

  /***********Objects Reference*********/
  rewardProgramSearchParameter: RewardProgramSearchParameter = new RewardProgramSearchParameter() ;

  /***********Model Reference*********/
  rewardProgramList: RewardProgramList[] = [];
  selectedBranchTypeList: BranchListRewardProgram[] = new Array<BranchListRewardProgram>();
  branchList: BranchListRewardProgram[] = [];

  /*********** Configurations *********/
  appSourceID = EnumSaleSourceType;
  action_Status = ENU_Reward_Action_Progress;

  /*********** Local *******************/
  isEditAllow: boolean;
  isDeleteAllow: boolean;
  isSaveAllow: boolean;
  currentBranchSubscription: SubscriptionLike;
  branchID: number;
  isDataExists: boolean = false;

  constructor(
    private _dialog: MatDialogService,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _router: Router,
    private _authService: AuthService,
  ) {
    this.getFundamentals();
   }

  ngOnInit(): void {
    this.rewardProgramSearchParameter.StatusIDs = "";
    this.rewardProgramSearchParameter.BranchID = "";
  } 

  ngAfterViewInit() {
    this.getAllrewardProgram();
  }
  getFundamentals() {
    this._httpService.get(BranchApi.BranchSearchList)
      .subscribe(data => {
        if (data.Result.length > 0) {
          this.branchList = data.Result;
        }
      },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Branch"));
        }
      );
    this.setPermissions();
  }

  setPermissions() {
    this.isDeleteAllow = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.RewardProgram_Delete);
    this.isSaveAllow = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.RewardProgram_Save);
    this.isEditAllow = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.RewardProgram_Save);
  }

  /* view reward program */
  onViewRewardProgram(rewardProgramID) {
    const dialogRef = this._dialog.open(RewardViewComponent, {
      disableClose: true,
      data: {
        rewardProgramID
      }
    });
  }

  /* pagination */
  reciviedPagination(pagination: boolean) {
    if (pagination) {
      this.getAllrewardProgram()
    }
  }
   
  /* Method to reset search filters */
  resetSearchFilter() {
    this.rewardProgramSearchParameter = new RewardProgramSearchParameter();
    this.rewardProgramSearchParameter.StatusIDs = "";
    this.rewardProgramSearchParameter.BranchID = "";
    this.appPagination.resetPagination();
    this.getAllrewardProgram();
  }

  /* get reward program list */
  getAllrewardProgram() {
    let rewardSearchSearch = JSON.parse(JSON.stringify(this.rewardProgramSearchParameter));
    rewardSearchSearch.PageNumber = this.appPagination.pageNumber;
    rewardSearchSearch.PageSize = this.appPagination.pageSize;
    this._httpService.get(RewardProgramApi.searchRewardProgram, rewardSearchSearch).subscribe(
      (data) => {

        this.isDataExists =
          data.Result != null && data.Result.length > 0 ? true : false;
        if (this.isDataExists) {
          this.rewardProgramList = data.Result;
          if (data.Result.length > 0) {
            this.appPagination.totalRecords = data.TotalRecord;
          } else {
            this.appPagination.totalRecords = 0;
          }
        } else {
          this.rewardProgramList = [];

          this.appPagination.totalRecords = 0;
        }
      },
      (error) => {
        this._messageService.showErrorMessage(
          this.messages.Error.Get_Error.replace("{0}", "Reward Program")
        );
      }
    );
  }

 
   /* Method to search all the reward program */
  searchAllRewardProgram() {
    this.appPagination.paginator.pageIndex = 0;
    this.appPagination.pageNumber = 1;
    this.getAllrewardProgram();
  }

  /* click event to edit the reward progrom */
  onEditRewardProgram(rewardProgramID: Number) {
    if (rewardProgramID > 0) {
      this._router.navigate([`/setup/reward-program/details/${rewardProgramID}`]);
    }
  }

  /* delete reward progrom */
  onDeleteRewardProgram(rewardProgram: any) {
     //here we check if the reward program is default then delete is not possible
     if(rewardProgram.IsDefault){
      this._messageService.showErrorMessage(this.messages.Error.Reward_Program_Default_Error);
    }else{
      const dialogRef = this._dialog.open(RewardProgramDelete, {
      disableClose: true,
    });
    dialogRef.componentInstance.terminationScheduledDate.subscribe((terminationDate: any) => {
      let params = {
        RewardProgramID: rewardProgram.RewardProgramID,
        ArchivePlanDate: terminationDate
      }
      this._httpService.save(RewardProgramApi.deleteRewardProgram, params)
        .subscribe(
          (response: ApiResponse) => {
            if (response && response.MessageCode > 0) {
              this.searchAllRewardProgram();
            }
            else {
              this._messageService.showErrorMessage(response.MessageText);
            }
          },
          error => {
            this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Reward Program"))
          }
        );
    })
  }
  }

  /* revert reward progrom */
  onRevertRewardProgram(rewardProgramID: any) {
    const dialog = this._dialog.open(AlertConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Dialog_Title.AlertRewardTermination,
        Message: this.messages.Confirmation.Confirmation_Revert_Program,
        isChangeIcon: false,
        showButton: true,
        showConfirmCancelButton: true,
      }
    });

    dialog.componentInstance.confirmChange.subscribe(isConfirm => {
      if (isConfirm) {

        this._httpService.save(RewardProgramApi.revertRewardProgram, rewardProgramID)
          .subscribe(
            (response: ApiResponse) => {
              if (response && response.MessageCode > 0) {
                this.searchAllRewardProgram();
              }
              else {
                this._messageService.showErrorMessage(response.MessageText);
              }
            },
            error => {
              this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Reward Program"))
            }
          );
      }
    })
  }

  // calls when click on default reward program button(select and unselect)
  onDefaultRewardProgram(rewardProgramID) {
    const dialog = this._dialog.open(AlertConfirmationComponent, {
      disableClose: true,
      data: {
        Title: this.messages.Dialog_Title.AlertRewardTermination,
        Heading: this.messages.Confirmation.Confirmation_Revert_Program_default_heading,
        Message: this.messages.Confirmation.Confirmation_Revert_Program_default_Message,
        isChangeIcon: false,
        showButton: true,
        showConfirmCancelButton: true,
      }
    });
    dialog.componentInstance.confirmChange.subscribe(isConfirm => {
      if (isConfirm) {
        let params = {
          rewardProgramID: rewardProgramID,
          branchID: this.branchID,
          isDefault: true,
        }
        this._httpService.save(RewardProgramApi.defaultRewardProgram, params)
          .subscribe(
            (response: ApiResponse) => {
              if (response && response.MessageCode > 0) {
                this.searchAllRewardProgram();
              }
              else {
                this._messageService.showErrorMessage(response.MessageText);
              }
            },
            error => {
              this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Reward Program"))
            }
          );
      }
    })
  }
}

