import {NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegistrationRoutingModule} from './registration-routing.module';

import {PfRegistrationListComponent} from './pfregistration/pf-registration-list/pf-registration-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  PFOrganisationRegistrationComponent
} from './pfregistration/pf-registration/p-forganisation-registration/p-forganisation-registration.component';
import {RouterModule} from '@angular/router';
import {ContactPersonDetailComponent} from './pfregistration/pf-registration/contact-person-detail/contact-person-detail.component';
import {IntroductiveDetailsComponent} from './pfregistration/pf-registration/introductive-details/introductive-details.component';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PropriterComponent} from './pfregistration/pf-registration/propriter/propriter.component';
import {DataTablesModule} from 'angular-datatables';
import {ToastrModule} from 'ngx-toastr';
import {NomineeComponent} from './nominee/nominee.component';
import {PfemployeerigistrationComponent} from './pfemployeerigistration/pfemployeerigistration.component';
import {PfemployeerigistrationlistComponent} from './pfemployeerigistrationlist/pfemployeerigistrationlist.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationRegistrationComponent } from './organization-registration/organization-registration.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@NgModule({
  declarations: [
    PfRegistrationListComponent,
    PFOrganisationRegistrationComponent,

    ContactPersonDetailComponent,
    IntroductiveDetailsComponent,
    PropriterComponent,

    NomineeComponent,
    PfemployeerigistrationComponent,
    PfemployeerigistrationlistComponent,
    OrganizationRegistrationComponent,
    EmployeeDetailsComponent,

  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CollapseModule.forRoot(),
    ModalModule,
    DataTablesModule,
    
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-center'
    }),
    NgSelectModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RegistrationModule { }
