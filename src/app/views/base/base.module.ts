import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BaseRoutingModule} from './base-routing.module';
import {AlertModule} from 'ngx-bootstrap/alert';
import {ReactiveFormsModule} from '@angular/forms';
import {PermissionComponent} from './permission/permission.component';
import {UserComponent} from './user/user.component';
import {RoleComponent} from './role/role.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {DataTablesModule} from 'angular-datatables';
import {RolesComponent} from './roles/roles.component';


@NgModule({
  declarations: [
    PermissionComponent,
    UserComponent,
    RoleComponent,
    RolesComponent

  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule,
    DataTablesModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right'
    })

  ],
  providers:[ToastrService]
})
export class BaseModule { }
