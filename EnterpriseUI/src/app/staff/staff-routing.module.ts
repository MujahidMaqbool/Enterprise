import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchStaffComponent } from '@app/staff/search/search.staff.component';
import { StaffNavigation } from './navigation/main/staff.navigation.component';



const routes: Routes = [
    
  {
    path: '',
    component: StaffNavigation,
    children: [
      {
        path: '',
        redirectTo: 'search'
      },
      {
        path: 'search',
        component: SearchStaffComponent,
       
      },
      { path: '**', redirectTo: 'search', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
