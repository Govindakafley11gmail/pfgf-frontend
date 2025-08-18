import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GfCompanyRoutingModule} from './gf-company-routing.module';
import {CompanyComponent} from './company/company.component';
import {ProprietorComponent} from './proprietor/proprietor.component';
import {ContactPersonComponent} from './contact-person/contact-person.component';
import {IntroducerComponent} from './introducer/introducer.component';
import {CompanyListComponent} from './company-list/company-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DataTablesModule} from 'angular-datatables';
import {ToastrModule} from 'ngx-toastr';
import {NgSelectModule} from '@ng-select/ng-select';
import {GfEmployeeListComponent} from './gf-employee-list/gf-employee-list.component';
import {GfEmployeeRegistrationComponent} from './gf-employee-registration/gf-employee-registration.component';


@NgModule({
  declarations: [
    CompanyComponent,
    ProprietorComponent,
    ContactPersonComponent,
    IntroducerComponent,
    CompanyListComponent,
    GfEmployeeListComponent,
    GfEmployeeRegistrationComponent
  ],
  imports: [
    CommonModule,
    GfCompanyRoutingModule,
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
  ]
})
export class GfCompanyModule { }
