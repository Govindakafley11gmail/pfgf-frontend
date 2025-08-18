import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExcessPaymentDashboardComponent} from './excess-payment-dashboard/excess-payment-dashboard.component';
import {PfIndividualDepositListComponent} from './pf-individual-deposit-list/pf-individual-deposit-list.component';
import {RefunddashboardComponent} from './refunddashboard/refunddashboard.component';


const routes: Routes = [
  {path:'pfdepositlist',component:PfIndividualDepositListComponent},
  {path:'refunddashboard',component:RefunddashboardComponent},
  {path:'excess-payment-refund',component:ExcessPaymentDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
