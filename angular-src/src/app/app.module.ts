import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';

import {ServiceWorkerModule} from '@angular/service-worker';
import {AppComponent} from './app.component';

import {environment} from '../environments/environment';

import {LogSwUpdateService} from './services/log-sw-update.service';
import {ApiModule, Configuration} from './swagger-api';
import {DefaultLayoutComponent} from './components/layouts/default-layout/default-layout.component';
import {UserLayoutComponent} from './components/layouts/user-layout/user-layout.component';
import {AdminLayoutComponent} from './components/layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AuthClientService} from './services/auth-client.service';
import {LocalStorageService} from './services/local-storage.service';
import {NgReduxModule} from '@angular-redux/store';
import {FooterComponent} from './components/footer/footer.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NavbarScrollDirective} from './directives/navbar-scroll.directive';
import {PrimeNgImportsModule} from './primeng-import.module';
import {AlertService} from './services/alert.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {ResumeComponent} from './components/resume/resume.component';
import {ResumeGuardGuard} from './guards/resume-guard.guard';
import {TasksComponent} from './components/tasks/tasks.component';
import {TaskFormComponent} from './components/task-form/task-form.component';
import {TaskClientService} from './services/task-client.service';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    ResumeComponent,
    TasksComponent,
    TaskFormComponent,
    NavbarScrollDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    ApiModule.forRoot(configurationApi),
    PrimeNgImportsModule
  ],
  providers: [
    MessageService,
    LogSwUpdateService,
    AuthClientService,
    TaskClientService,
    LocalStorageService,
    AlertService,
    ResumeGuardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function configurationApi(): Configuration {
  if (environment.production) {
    return new Configuration({
      basePath: 'https://tsoanartc.herokuapp.com/api'
    });
  } else {
    return new Configuration({
      basePath: 'http://localhost:8080/api'
    });
  }
}
