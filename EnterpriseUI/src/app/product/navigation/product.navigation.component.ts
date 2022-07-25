import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/helper/app.auth.service';
import { ENU_Permission_Module, ENU_Permission_Product } from 'src/app/helper/config/app.module.page.enums';

@Component({
  selector: 'product-navigation',
  templateUrl: './product.navigation.component.html'
})
export class NavigationProductComponent implements OnInit {

  allowedNavigationPages = {
    Category: false,
    Brand: false,
    Supplier: false,
    Product: false,
    Attribute: false,
    PurchaseOrders: false
  }

  constructor(public _authService: AuthService) { }

  ngOnInit() {
    this.setPermission();
   }

  setPermission() {
    this.allowedNavigationPages.Category = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Category_View);
    this.allowedNavigationPages.Brand = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Brand_View);
    this.allowedNavigationPages.Supplier = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Supplier_View);
    this.allowedNavigationPages.Attribute = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Attribute_View);
    this.allowedNavigationPages.Product = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.Product_View);
    this.allowedNavigationPages.PurchaseOrders = this._authService.hasPagePermission(ENU_Permission_Module.Product, ENU_Permission_Product.PO_View);
  }

}
