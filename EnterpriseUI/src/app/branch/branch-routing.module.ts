import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './search/search.branches.component';
import { branchNavigation } from './navigation/main/branch.navigation.component';


const routes: Routes = [
  
  {
    path: '',
    component: branchNavigation,
    children: [
      {
        path: '',
        redirectTo: 'search'
      },
      {
        path: 'search',
        component: BranchesComponent,
       
      },

      { path: '**', redirectTo: 'search', pathMatch: 'full' }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
