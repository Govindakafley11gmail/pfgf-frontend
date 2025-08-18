import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTransferRoutingModule } from './employee-transfer-routing.module';
import { EmployeeTransferComponent } from './employee-transfer/employee-transfer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    EmployeeTransferComponent
  ],
  imports: [
    CommonModule,
    EmployeeTransferRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CollapseModule.forRoot(),
    ModalModule,
    DataTablesModule,

    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-center'
    }),
    NgSelectModule
  ]
})
export class EmployeeTransferModule { }
