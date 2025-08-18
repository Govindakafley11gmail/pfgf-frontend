import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTransferComponent } from './employee-transfer/employee-transfer.component';

const routes: Routes = [
  {path:'employee-transfer',component:EmployeeTransferComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTransferRoutingModule { }
