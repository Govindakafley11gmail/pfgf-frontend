import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserGuard} from '../_guard/user.guard';

import {PermissionComponent} from './permission/permission.component';
import {RoleComponent} from './role/role.component';
import {RolesComponent} from './roles/roles.component';
import {UserComponent} from './user/user.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base'
    },
    children: [
      {
        path: '',
        redirectTo: 'cards'
      },
      {
        path: 'role',
        component: RoleComponent,canActivate:[UserGuard],
        data: {
          title: 'Role'
        }
      },
      {
        path: 'roles',
        component: RolesComponent,canActivate:[UserGuard],
        data: {
          title: 'Roles'
        }
      },
      {
        path: 'user',
        component: UserComponent,canActivate:[UserGuard],
        data: {
          title: 'User'
        }
      },
      {
        path: 'permission',
        component: PermissionComponent,canActivate:[UserGuard],
        data: {
          title: 'Permission'
        },

      }

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[UserGuard]
})
export class BaseRoutingModule { }
