import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommandBusModule } from './command-bus/command-bus.module';
import { QueryBusModule } from './query-bus/query-bus.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommandBusModule,
    QueryBusModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
