import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Import Containers
import {DefaultLayoutComponent} from './containers';
import { DownloadFormComponent } from './download-form/download-form.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ErrorComponent } from './views/error/error.component';

import {LoginComponent} from './views/login/login.component';
import { ProfileComponent } from './views/profile/profile.component';
import {RegisterComponent} from './views/register/register.component';
import { UserGuard } from './views/_guard/user.guard';
import { SearchComponent } from './views/search/search.component';

export const routes: Routes = [
  {
    path: 'login',pathMatch: 'full',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,canActivate:[UserGuard],
    data:{
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule),canActivate:[UserGuard]
      },
      {
        path: 'department',
        loadChildren: () => import('./views/mastersetup/mastersetup.module').then(m => m.MastersetupModule),canActivate:[UserGuard]
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[UserGuard]
      },
      {
        path: 'registration',
        loadChildren: () => import('./views/registration/registration.module').then(m => m.RegistrationModule),canActivate:[UserGuard]
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
      ,
      {
        path: 'accounts',
        loadChildren: () => import('./views/account/account.module').then(m => m.AccountModule),canActivate:[UserGuard]
      },
      {
        path: 'transaction',
        loadChildren: () => import('./views/transaction/transaction.module').then(m => m.TransactionModule),canActivate:[UserGuard]
      }
      ,
      {
        path: 'report',
        loadChildren: () => import('./views/report/report.module').then(m => m.ReportModule),canActivate:[UserGuard]
      },
      // --------------------gfcompany------------

      {
        path: 'registration',
        loadChildren: () => import('./views/GFComponent/gf-company/gf-company.module').then(m => m.GfCompanyModule),canActivate:[UserGuard]
      },
      {
        path: 'employee',
        loadChildren: () => import('./views/employee-transfer/employee-transfer.module').then(m => m.EmployeeTransferModule),canActivate:[UserGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'employeeSearch',
        component: SearchComponent,
      },
      {
        path: 'download-form',
        component: DownloadFormComponent,
      },
      // --------------------gfcompany------------
    ]
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      title: 'Page 404'
    }
  },
  {path: '**', redirectTo: '404'},
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
