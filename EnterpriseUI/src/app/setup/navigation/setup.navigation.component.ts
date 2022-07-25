import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/helper/app.auth.service';
import { ENU_Permission_Module, ENU_Permission_Setup } from 'src/app/helper/config/app.module.page.enums';

@Component({
  selector: 'app-navigation',
  templateUrl: './setup.navigation.component.html'
})
export class NavigationSetupComponent implements OnInit {
  allowedNavigationPages = {
    RewardProgram: false,
    Taxes: false,
    Roles: false
  }
  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this.setPermission();
   }
  setPermission() {
    this.allowedNavigationPages.RewardProgram = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.RewardProgram_View);
    this.allowedNavigationPages.Taxes = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.Tax_View);
    this.allowedNavigationPages.Roles = this._authService.hasPagePermission(ENU_Permission_Module.Setup, ENU_Permission_Setup.Role_View);
  }
}
