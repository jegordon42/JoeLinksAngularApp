import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import {MetadataService} from '../metadata_service'
import { App } from './app';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [MetadataService],
  bootstrap: [App],
})
export class AppServerModule {}
