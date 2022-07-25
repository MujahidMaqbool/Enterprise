// #region Imports

import { Component, Inject, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

/********************* Material:Refference ********************/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/********************** Services & Models *********************/
import { Messages } from 'src/app/helper/config/app.messages';
import { RewardProgramApi } from 'src/app/helper/config/app.webapi';
import { ApiResponse, DD_Branch } from 'src/app/models/common.model';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';

// #endregion

@Component({
  selector: 'app-reward-template',
  templateUrl: './reward.template.component.html',
})
export class RewardTemplateComponent implements OnInit {
  /*********** region Local Members ****/

  /* Messages */
  messages = Messages;

  /*********** Local *******************/
  showWidget: boolean = true;
  showApp: boolean = false;
  widgetactive: boolean = true;
  appactive: boolean = false;
  defaultDescription: string;
  currentBranchSubscription: SubscriptionLike;
  branchId: number;

  constructor(
    private dialogRef: MatDialogRef<RewardTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _httpService: HttpService,
    private _dataSharingService: DataSharingService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
      (branch: DD_Branch) => {
        if (branch) {
          this.branchId = branch.BranchID;
        }
      }
    )
    this.getRewardProgramDescription();
  }

  ngOnDestroy() {
    this.currentBranchSubscription.unsubscribe();
  }

  /***** get branch Default Reward program Description ******/ 
  getRewardProgramDescription() {
    this._httpService.get(RewardProgramApi.getRewardProgramDescription + this.branchId)
      .subscribe(
        (response: ApiResponse) => {
          if (response && response.MessageCode > 0) {
            this.defaultDescription = response.Result.BranchDefaultTemplate
          }
        },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "Reward Program description"))
        }
      );
  }

  /***** close the reward program dialog ******/
  closeDialog() {
    this.dialogRef.close();
  }

  /***** onclick App button ******/ 
  onClickApp() {
    this.showWidget = false;
    this.showApp = true;
    this.appactive = true;
    this.widgetactive = false;
  }

  /***** onclick Widget button ******/ 
  onClickWidget() {
    this.showWidget = true;
    this.showApp = false;
    this.widgetactive = true;
    this.appactive = false;
  }
}
