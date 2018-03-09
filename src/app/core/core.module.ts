import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { CustomErrorHandler } from '@app/core/error-handling/custom-error-handler';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    CustomErrorHandler
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
