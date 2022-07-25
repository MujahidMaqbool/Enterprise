import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { HttpService } from 'src/app/services/app.http.service';
import { StaffApi } from 'src/app/helper/config/app.webapi'
import { StaffAssignEnterPriseRole } from '../models/staff.models';
import { RoleViewComponent } from 'src/app/shared-components/role-view/role-view.component';
@Component({
  selector: 'app-assign-role',
  templateUrl: './assign.role.component.html',
})
export class AssignRolePopupComponent implements OnInit {
  staffRoleList: any;
  isDataExists: boolean;
  StaffAssignEnterPriseRole: StaffAssignEnterPriseRole = new StaffAssignEnterPriseRole();
  @Output()
  roleSaved = new EventEmitter<boolean>();
  constructor(
    private dialogRef: MatDialogRef<AssignRolePopupComponent>,
    private _dialog: MatDialogService,
    private _staffService: HttpService,
    @Inject(MAT_DIALOG_DATA) public staffRoles: any
  ) { }

  ngOnInit(): void {
    this.staffRoleList = this.staffRoles;
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.StaffAssignEnterPriseRole.AllowLogin = this.staffRoleList[0].allowLogin;
    //this.StaffAssignEnterPriseRole.RoleID = this.staffRoleList[0].RoleID;
    this.StaffAssignEnterPriseRole.StaffID = this.staffRoleList[0].staffID;
    this.StaffAssignEnterPriseRole.RoleID = this.staffRoleList[0].enterpriseRoleID > 0 ? this.staffRoleList[0].enterpriseRoleID: 0;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onViewRole() {
    this._dialog.open(RoleViewComponent, {
      disableClose: true,
      data: this.StaffAssignEnterPriseRole.RoleID,
    });
  }

  getRoleView(staffViewRoles: any) {
    this._dialog.open(RoleViewComponent, {
      disableClose: true,
      data: staffViewRoles,
    });
  }

  onSave() {
    let param = {
      allowLogin: this.StaffAssignEnterPriseRole.AllowLogin,
      roleID: this.StaffAssignEnterPriseRole.RoleID,
      staffID: this.StaffAssignEnterPriseRole.StaffID
    };
    this._staffService.save(StaffApi.enterPriseAssigneRole, param)
      .subscribe(data => {
        this.isDataExists = data.Result != null && data.Result.length > 0 ? true : false;
        this.roleSaved.emit(true);
      });
  }


}
