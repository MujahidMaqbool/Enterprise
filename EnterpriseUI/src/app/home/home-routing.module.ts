import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationGuard } from "@app/helper/app.route.guard";
import { HomeComponent } from "./home.component";
import { PagePermissionGuard, ModulePermissionGuard } from "@app/helper/app.permission.guard";
import { ENU_Permission_Module, ENU_Permission_Setup } from "@app/helper/config/app.module.page.enums";

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
        loadChildren: "@branch/branch.module#BranchModule",
        // canActivate: [ModulePermissionGuard],
        // data: { module: ENU_Permission_Module.Branches }
      },
      {
        path: "staff",
        loadChildren: "@staff/staff.module#StaffModule",
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Staff }
      },
      {
        path: "customer",
        loadChildren: "@customer/customer.module#CustomerModule",
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Customer }
      },
      {
        path: "setup",
        loadChildren: "@setup/setup.module#SetupModule",
        canActivate: [ModulePermissionGuard],
        data: { module: ENU_Permission_Module.Setup }
      },
      {
        path: "product",
        loadChildren: "@product/product.module#ProductModule",
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
