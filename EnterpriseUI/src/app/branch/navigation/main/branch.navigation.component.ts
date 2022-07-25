import { Component } from '@angular/core';
import { AuthService } from 'src/app/helper/app.auth.service';
import { ENU_Permission_Module, ENU_Permission_Branch } from 'src/app/helper/config/app.module.page.enums';

@Component({
  selector: 'branch-navigation',
  templateUrl: './branch.navigation.component.html'
})
export class branchNavigation {

  allowedClientPages = {
    View: false
  }

  constructor(public _authService: AuthService,) {
  }

  setPermissions() {

    this.allowedClientPages.View = this._authService.hasPagePermission(ENU_Permission_Module.Branches, ENU_Permission_Branch.Branch_View);

  }


}
