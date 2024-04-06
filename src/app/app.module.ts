import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { App } from './app'
import { AppRoutingModule } from './app_routing_module';
import { Home } from '../views/home/home';
import { Lookup } from 'src/views/lookup/lookup';
import { Header } from 'src/components/header/header';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {OverlayModule} from '@angular/cdk/overlay';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    App
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    Header,
    Home,
    Lookup,
    OverlayModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
