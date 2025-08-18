import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompanyListComponent} from './company-list/company-list.component';
import {CompanyComponent} from './company/company.component';
import {GfEmployeeListComponent} from './gf-employee-list/gf-employee-list.component';
import {GfEmployeeRegistrationComponent} from './gf-employee-registration/gf-employee-registration.component';

const routes: Routes = [
  {path:"company-list",component:CompanyListComponent},
  {path:"company-registration",component:CompanyComponent},
  {path:"company-registration/:id",component:CompanyComponent},
  {path:'employee-list',component:GfEmployeeListComponent},
  {path:'employee-registration',component:GfEmployeeRegistrationComponent},
  {path:'employee-registration/:id',component:GfEmployeeRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GfCompanyRoutingModule { }
