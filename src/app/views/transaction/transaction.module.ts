import {NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransactionRoutingModule} from './transaction-routing.module';
import {PfIndividualDepositListComponent} from './pf-individual-deposit-list/pf-individual-deposit-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DataTablesModule} from 'angular-datatables';
import {ToastrModule} from 'ngx-toastr';
import {PfIndividualApprovedDepositComponent} from './pf-individual-approved-deposit/pf-individual-approved-deposit.component';
import {PfIndividualPendingDepositComponent} from './pf-individual-pending-deposit/pf-individual-pending-deposit.component';
import {RefunddashboardComponent} from './refunddashboard/refunddashboard.component';
import {RefundpendingprocessComponent} from './refundpendingprocess/refundpendingprocess.component';
import {RefundapprovedlistComponent} from './refundapprovedlist/refundapprovedlist.component';
import {RefundcompletedlistComponent} from './refundcompletedlist/refundcompletedlist.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {LoadingComponent} from '../../loading';
import {ExcessPaymentDashboardComponent} from './excess-payment-dashboard/excess-payment-dashboard.component';
import { RefundViewPendingComponent } from './refund-view-pending/refund-view-pending.component';
import { RefundApprovalComponent } from './refund-approval/refund-approval.component';

@NgModule({
  declarations: [
    PfIndividualDepositListComponent,
    PfIndividualApprovedDepositComponent,
    PfIndividualPendingDepositComponent,
    RefunddashboardComponent,
    RefundpendingprocessComponent,
    RefundapprovedlistComponent,
    RefundcompletedlistComponent,
    LoadingComponent,
    ExcessPaymentDashboardComponent,
    RefundViewPendingComponent,
    RefundApprovalComponent

  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CollapseModule.forRoot(),
    ModalModule,
    DataTablesModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-center'
    }),
    NgSelectModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TransactionModule { }
