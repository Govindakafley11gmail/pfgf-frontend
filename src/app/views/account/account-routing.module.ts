import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountPostingComponent} from './account-posting/account-posting.component';
import {CollectionlistComponent} from './collectionlist/collectionlist.component';
import {PaymentComponent} from './payment/payment.component';
import { AccountPostingListComponent } from './account-posting/account-posting-list/account-posting-list.component';

const routes: Routes = [
  {path:"payment",component:PaymentComponent},
  {path:"collectionlist",component:CollectionlistComponent},
  {path:'account-posting',component:AccountPostingComponent},
   {path:'account-list',component:AccountPostingListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
