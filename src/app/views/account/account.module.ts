import {NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {PaymentComponent} from './payment/payment.component';
import {PendingPaymentComponent} from './pending-payment/pending-payment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DataTablesModule} from 'angular-datatables';
import {ToastrModule} from 'ngx-toastr';
import {NgSelectModule} from '@ng-select/ng-select';
import {CollectionlistComponent} from './collectionlist/collectionlist.component';
import {PaymentApprovedComponent} from './payment-approved/payment-approved.component';
import {AccountPostingComponent} from './account-posting/account-posting.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountPostingListComponent } from './account-posting/account-posting-list/account-posting-list.component';
// import { AccountPostingComponent } from './account-posting/account-posting.component';



@NgModule({
  declarations: [
    PaymentComponent,
    PendingPaymentComponent,
    CollectionlistComponent,
    PaymentApprovedComponent,
    AccountPostingComponent,
    AccountPostingListComponent,
    // AccountPostingComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    AccountRoutingModule,
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
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AccountModule { }
