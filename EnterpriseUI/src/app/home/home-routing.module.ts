import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationGuard } from "src/app/helper/app.route.guard";
import { HomeComponent } from "./home.component";
import { PagePermissionGuard, ModulePermissionGuard } from "src/app/helper/app.permission.guard";
import { ENU_Permission_Module, ENU_Permission_Setup } from "src/app/helper/config/app.module.page.enums";

const routes: Routes = [

  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: "",
        redirectTo: "branches",
        pathMatch: "full",
      },
      {
        path: "branches",
        loadChildren: () => import('src/app/branch/branch.module').then(m => m.BranchModule),
        // canActivate: [ModulePermissionGuard],
        // data: { module: ENU_Permission_Module.Branches }
      },
      {
        path: "staff",
        loadChildren: () => import('src/app/staff/staff.module').then(m => m.StaffModule),
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Staff }
      },
      {
        path: "customer",
        loadChildren: () => import('src/app/customer/customer.module').then(m => m.CustomerModule),
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Customer }
      },
      {
        path: "setup",
        loadChildren: () => import('src/app/setup/setup.module').then(m => m.SetupModule),
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Setup }
      },
      {
        path: "product",
        loadChildren: () => import('src/app/product/product.module').then(m => m.ProductModule),
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Product }
      },
     
      { path: "**", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
