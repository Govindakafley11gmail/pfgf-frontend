import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportGenerateComponent} from './report-generate/report-generate.component';

const routes: Routes = [
  {path:'generate-report',component:ReportGenerateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
