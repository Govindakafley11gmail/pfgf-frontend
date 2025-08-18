import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountGroupComponent} from './account-group/account-group.component';
import {AccountTypeComponent} from './account-type/account-type.component';
import {BankDetailsComponent} from './bank-details/bank-details.component';
import {BranchComponent} from './branch/branch.component';
import {DepartmentlistComponent} from './departmentlist/departmentlist.component';
import {StakeholderComponent} from './stakeholder/stakeholder.component';

const routes: Routes = [
  {path:'branch',component:BranchComponent},
  {path: 'departmentlist',component:DepartmentlistComponent},
  {path: 'stakeholder',component:StakeholderComponent},
  {path:'accounttype',component:AccountTypeComponent},
  {path:'accountgroup',component:AccountGroupComponent},
  {path:'bankdetails',component:BankDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class MastersetupRoutingModule { }
