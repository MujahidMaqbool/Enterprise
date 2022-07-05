import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.password.component';
import { SavePasswordComponent } from './new-password/new.password.component';
import { ChangePasswordComponent } from './change-password/change.password.component';

const routes: Routes = [
  { path: 'forgot-password', component: ForgotComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'save-password/:token', component: SavePasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:ID', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
