import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MastersetupRoutingModule} from './mastersetup-routing.module';
import {BranchComponent} from './branch/branch.component';
import {DepartmentlistComponent} from './departmentlist/departmentlist.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {StakeholderComponent} from './stakeholder/stakeholder.component';
import {AccountGroupComponent} from './account-group/account-group.component';
import {AccountTypeComponent} from './account-type/account-type.component';
import {DataTablesModule} from 'angular-datatables';
import {BankDetailsComponent} from './bank-details/bank-details.component';


@NgModule({
  declarations: [BranchComponent,DepartmentlistComponent, StakeholderComponent, AccountGroupComponent, AccountTypeComponent, BankDetailsComponent],
  imports: [
    CommonModule,
    MastersetupRoutingModule,
    ReactiveFormsModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule

  ],
  providers : [BrowserModule,FormsModule]
})
export class MastersetupModule { }
