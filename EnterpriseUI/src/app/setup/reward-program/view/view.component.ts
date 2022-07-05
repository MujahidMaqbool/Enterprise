// #region Imports

/********************** Angular Refrences *********************/
import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

/********************* Material:Refference ********************/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/********************** Configuration *********************/
import { RewardProgramActivityType, RewardProgramPurchasesType } from '@app/helper/config/app.enums';

/********************** Services & Models *********************/
import { Messages } from '@app/helper/config/app.messages';
import { RewardProgramApi } from '@app/helper/config/app.webapi';
import { ApiResponse, DD_Branch } from '@app/models/common.model';
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { DataSharingService } from '@app/services/data.sharing.service';
import { RewardProgramModel } from '../models/reward-program.model';

// #endregion

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
})
export class RewardViewComponent implements OnInit {
  /*********** region Local Members ****/

  /* Messages */
  messages = Messages;

  /*********** Objects *********/
  rewardProgram: RewardProgramModel = new RewardProgramModel();

  /***********Model Reference*********/
  /*********** Collections *********/
  classCount: any = [];
  productCount: any = [];
  membershipCount: any = [];
  serviceCount: any = [];

  /*********** Configurations *********/
  enum_PurchasesType = RewardProgramPurchasesType;
  enum_ActivitesEarningTypes = RewardProgramActivityType;
  currentBranchSubscription: SubscriptionLike;

  /*********** locals *********/
  formsCount: number;
  currencyFormat: string;
  membershipCoount: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dataSharingService: DataSharingService,
    private dialogRef: MatDialogRef<RewardViewComponent>,
    private _httpService: HttpService,
    private _messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
      (branch: DD_Branch) => {
        if (branch) {
          this.currencyFormat = branch.CurrencySymbol;
        }
      }
    )
    this.onViewRewardProgram();
  }

  ngOnDestroy() {
    this.currentBranchSubscription.unsubscribe();
  }

  /** get the reward program details by ID**/
  onViewRewardProgram() {
    this._httpService.get(RewardProgramApi.viewRewardProgram + this.data.rewardProgramID)
      .subscribe(
        (response: ApiResponse) => {

          if (response && response.MessageCode > 0) {
            if (response.Result) {
              this.rewardProgram = response.Result;
              this.classCount = this.rewardProgram.RewardProgramEarningRuleExceptionVM.filter(i => i.ItemTypeID == this.enum_PurchasesType.Class);
              this.membershipCount = this.rewardProgram.RewardProgramEarningRuleExceptionVM.filter(i => i.ItemTypeID == this.enum_PurchasesType.Membership);
              this.productCount = this.rewardProgram.RewardProgramEarningRuleExceptionVM.filter(i => i.ItemTypeID == this.enum_PurchasesType.Product);
              this.serviceCount = this.rewardProgram.RewardProgramEarningRuleExceptionVM.filter(i => i.ItemTypeID == this.enum_PurchasesType.Service);
              this.formsCount = this.rewardProgram.RewardProgramActivitiesEarningRuleExceptionVM.length;
            }
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

  /*Close the view dialog*/
  closeDialog() {
    this.dialogRef.close();
  }
  
}
