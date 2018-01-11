import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';

import {ServiceWorkerModule} from '@angular/service-worker';
import {AppComponent} from './app.component';

import {environment} from '../environments/environment';

import {LogSwUpdateService} from './services/log-sw-update.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [LogSwUpdateService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
