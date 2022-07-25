import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationSetupComponent } from './navigation/setup.navigation.component';
import { RoleSaveComponent } from './role/role-save/role-save.component';
import { RoleSearchComponent } from './role/role-search/role-search.component';
import { PagePermissionGuard } from 'src/app/helper/app.permission.guard';
import { ENU_Permission_Module, ENU_Permission_Setup } from 'src/app/helper/config/app.module.page.enums';
import { SearchRewardProgramComponent } from './reward-program/search/reward.program.search.component';
import { SaveRewardProgramComponent } from './reward-program/save/reward.program.save.component';
import { SearchTaxComponent } from './taxes/search/search.taxes.component';

const routes: Routes = [

  {
    path: '',
    component: NavigationSetupComponent,
    children: [
      {
        path: '',
        redirectTo: 'reward-program',
      },
      {
        path: 'reward-program',
        component: SearchRewardProgramComponent,
      },
      {
        path: 'roles',
        component: RoleSearchComponent,
        canActivate: [PagePermissionGuard],
        data: { module: ENU_Permission_Module.Setup, page: ENU_Permission_Setup.Role_View }
      },
      {
        path: 'roles/save/:RoleID',
        component: RoleSaveComponent,
        canActivate: [PagePermissionGuard],
        data: { module: ENU_Permission_Module.Setup, page: ENU_Permission_Setup.Role_Save }
      },
      {
        path: 'taxes',
        component: SearchTaxComponent,
        canActivate: [PagePermissionGuard],
        data: { module: ENU_Permission_Module.Setup, page: ENU_Permission_Setup.Tax_View }
      },
      {
        path: 'reward-program/details/:ID',
        component: SaveRewardProgramComponent,
      },
      { path: '**', redirectTo: 'reward-program', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
