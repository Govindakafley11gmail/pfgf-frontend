import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportRoutingModule} from './report-routing.module';

import {NgSelectModule} from '@ng-select/ng-select';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ReportGenerateComponent} from './report-generate/report-generate.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ToastrModule} from 'ngx-toastr';

import {MatDatepickerModule} from '@angular/material/datepicker';

// import { YearPickerComponent } from './year-picker/year-picker.component';


@NgModule({
  declarations: [
    ReportGenerateComponent,


  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    ModalModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-center'
    }),
    NgSelectModule,
    MatDatepickerModule,



  ]})
export class ReportModule { }
