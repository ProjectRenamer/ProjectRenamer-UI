import { NgModule, ErrorHandler } from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { appRouter } from './app.routing';

import { CustomErrorHandler } from '@app/core/error-handling/custom-error-handler';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    appRouter,
    CoreModule,
    SharedModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
