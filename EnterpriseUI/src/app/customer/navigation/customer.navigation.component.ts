import { Component } from '@angular/core';
import { AuthService } from '@app/helper/app.auth.service';
import { ENU_Permission_Module, ENU_Permission_Customer } from '@app/helper/config/app.module.page.enums';

@Component({
  selector: 'app-navigation',
  templateUrl: './customer.navigation.component.html'
})
export class NavigationComponent {
  allowedPages = {
    View: false,
  };

  constructor(public _authService: AuthService, ) {
    this.setPermissions();
  }

  setPermissions() {
    this.allowedPages.View = this._authService.hasPagePermission(ENU_Permission_Module.Customer, ENU_Permission_Customer.Customer_View);
  }



}
