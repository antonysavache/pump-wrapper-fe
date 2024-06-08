import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {SpyTradesComponent} from "./pages/spy-trades/spy-trades.component";
import {NgForOf, NgIf} from "@angular/common";
import {FileUploadComponent} from "./components/file-upload.component";

@NgModule({
  declarations: [
    SpyTradesComponent,
    FileUploadComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: 'spy', component: SpyTradesComponent},
    ]),
    NgForOf,
    NgIf
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}


