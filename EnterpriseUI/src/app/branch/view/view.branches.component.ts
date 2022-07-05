import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Messages } from '@app/helper/config/app.messages';
import { BranchApi } from '@app/helper/config/app.webapi';
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { WeekDays } from "@app/helper/config/app.enums";
import { Configurations } from '@app/helper/config/app.config';
import { Branch } from '../models/branch.models';

@Component({
  selector: 'app-branches',
  templateUrl: './view.branches.component.html',
})
export class ViewBranchesComponent implements OnInit {

   messages = Messages;
   branch: Branch = new Branch();
   weekDays = WeekDays;
   timeFormat = Configurations.TimePlaceholder;

  constructor(
    private _httpService: HttpService,
    private _messageService: MessageService,
    public dialogRef: MatDialogRef<ViewBranchesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.getBranchInfo();
  }


  getBranchInfo() {
    let url = BranchApi.BranchDetail.replace("{branchID}", this.data.branchID.toString());
    this._httpService.get(url)
      .subscribe(data => {
        if (data.Result) {
          this.branch = data.Result;
          if (this.branch.BranchTimeFormat12Hours === true) {
            this.timeFormat = Configurations.TimePlaceholderWithFormat;
          } else {
            this.timeFormat = Configurations.TimePlaceholder;
          }
          this.setBranchWorkTimingsForEdit();
        }
      },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Branch"));
        }
      );
  }

  setBranchWorkTimingsForEdit() {
    if(this.branch.BranchWorkTimeList.length > 0 ){
      this.branch.BranchWorkTimeList.forEach((branchTime) => {
        switch (branchTime.DayID) {
          case this.weekDays.Monday: {
            this.branch.MondayStartTime = branchTime.StartTime;
            this.branch.MondayEndTime = branchTime.EndTime;
            break;
          }
          case this.weekDays.Tuesday: {
            this.branch.TuesdayStartTime = branchTime.StartTime;
            this.branch.TuesdayEndTime = branchTime.EndTime;
            break;
          }
          case this.weekDays.Wednesday: {
            this.branch.WednesdayStartTime = branchTime.StartTime;
            this.branch.WednesdayEndTime = branchTime.EndTime;
            break;
          }
          case this.weekDays.Thursday: {
            this.branch.ThursdayStartTime = branchTime.StartTime;
            this.branch.ThursdayEndTime = branchTime.EndTime;
            break;
          }
          case this.weekDays.Friday: {
            this.branch.FridayStartTime = branchTime.StartTime;
            this.branch.FridayEndTime = branchTime.EndTime;
            break;
          }
          case this.weekDays.Saturday: {
            this.branch.SaturdayStartTime = branchTime.StartTime;
            this.branch.SaturdayEndTime = branchTime.EndTime;
            break;
          }
          case this.weekDays.Sunday: {
            this.branch.SundayStartTime = branchTime.StartTime;
            this.branch.SundayEndTime = branchTime.EndTime;
            break;
          }
        }
      });
    }
    }
  
  onCloseDialog() {
    this.dialogRef.close();
  }

  onCancel() {
    this.onCloseDialog();
  }

  

}
