import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/customer.navigation.component';
import { SearchCustomerComponent } from './search/search.customer.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        redirectTo: 'search'
      },
      {
        path: 'search',
        component: SearchCustomerComponent,
      },
      { path: '**', redirectTo: 'search', pathMatch: 'full' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
