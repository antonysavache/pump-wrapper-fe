import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ApiService } from "./services/api.service";
import { HttpClientModule } from "@angular/common/http";
import { AccountTradeService } from "./services/account-trade.service";
import {AppRoutingModule} from "./app-routing.module";
import {TokenCreationService} from "./services/token-creation.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [TokenCreationService, ApiService, AccountTradeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
