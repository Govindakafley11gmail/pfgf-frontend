import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NomineeComponent} from './nominee/nominee.component';

import {PfemployeerigistrationComponent} from './pfemployeerigistration/pfemployeerigistration.component';
import {PfemployeerigistrationlistComponent} from './pfemployeerigistrationlist/pfemployeerigistrationlist.component';
import {PfRegistrationListComponent} from './pfregistration/pf-registration-list/pf-registration-list.component';
import {ContactPersonDetailComponent} from './pfregistration/pf-registration/contact-person-detail/contact-person-detail.component';
import {IntroductiveDetailsComponent} from './pfregistration/pf-registration/introductive-details/introductive-details.component';
import {
  PFOrganisationRegistrationComponent
} from './pfregistration/pf-registration/p-forganisation-registration/p-forganisation-registration.component';
import { OrganizationRegistrationComponent } from './organization-registration/organization-registration.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';


const routes: Routes = [
  {path: "pfregistrationlist",component:PfRegistrationListComponent},
  {path: 'PFCompaneyRegistration',component:PFOrganisationRegistrationComponent},
  {path: 'PFCompaneyRegistration/:id',component:PFOrganisationRegistrationComponent},
  {path: 'contactPersonDetail',component:ContactPersonDetailComponent},
  {path:'introductiveDetails',component:IntroductiveDetailsComponent},
  {path:'pfemployeeregistration',component:PfemployeerigistrationComponent},
  {path:'pfemployeeregistration/:id',component:PfemployeerigistrationComponent},
  {path:'pfemployeeregistrationlist',component:PfemployeerigistrationlistComponent},
  {path:'nominee',component:NomineeComponent},
  {path:'organizationRegistration',component:OrganizationRegistrationComponent},
   {path:'employee-details',component:EmployeeDetailsComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
