import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';

import {ServiceWorkerModule} from '@angular/service-worker';
import {AppComponent} from './app.component';

import {environment} from '../environments/environment';

import {LogSwUpdateService} from './services/log-sw-update.service';
import {Configuration, ApiModule} from './swagger-api';
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
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    ApiModule.forRoot(() => new Configuration({basePath: 'http://localhost:8080/api'}))
  ],
  providers: [LogSwUpdateService, AuthClientService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
