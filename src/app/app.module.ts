import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, PathLocationStrategy, LocationStrategy } from '@angular/common';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule } from '@coreui/icons-angular';
import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule, } from '@coreui/angular';

// Import routing module
import { AppRoutingModule, routes } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './views/_service/auth.interceptor';
import { UserPipe } from './views/filter/user.pipe';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileComponent } from './views/profile/profile.component';
import { DownloadFormComponent } from './download-form/download-form.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ErrorComponent } from './views/error/error.component';
import { TokenService } from './views/_service/tokenServices';
import { SearchComponent } from './views/search/search.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
// import { APP_INITIALIZER } from '@angular/core';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    ReactiveFormsModule,
    FormsModule,
    // RouterModule,
    HttpClientModule,
    CommonModule,
    IconSetModule.forRoot(),
    DataTablesModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right'
    }),
    CollapseModule.forRoot(),
    ModalModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],

  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    LoginComponent,
    RegisterComponent,
    UserPipe,
    ProfileComponent,
    DownloadFormComponent,
    ChangePasswordComponent,
    ErrorComponent,
    SearchComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    FormsModule,
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (cache: any) => () => cache.clear(),
    //   deps: [Cache],
    //   multi: true
    // }

  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
