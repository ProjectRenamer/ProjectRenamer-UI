import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { CustomErrorHandler } from '@app/core/error-handling/custom-error-handler';
import { StorageService } from '@app/core/services/storage-service';
import { environment } from '@env/environment';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    CustomErrorHandler,
    StorageService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule,
    private storageService: StorageService) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
    if (!storageService.IsValueExist(this.storageService.webApiUrlKey)) {
      this.storageService.SaveValueToLocal(this.storageService.webApiUrlKey, 'http://localhost:80', new Date(environment.expireTime));
    }
  }
}
